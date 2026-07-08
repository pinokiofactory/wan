"""Headless WanGP generation CLI, driven via shared.api instead of the Gradio server.

Runs standalone (no server needs to be running) using the app/env venv:

    app/env/Scripts/python.exe generate.py --list-models
    app/env/Scripts/python.exe generate.py --model z_image --prompt "a red fox in snow"
    app/env/Scripts/python.exe generate.py --model t2v_1.3B --prompt "a boat on the sea" --frames 81

Local disk space on this machine is very tight, so by default this refuses to
submit a job for a model that isn't already fully downloaded (--force to
override and let WanGP fetch missing files).
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

LAUNCHER_ROOT = Path(__file__).resolve().parent
ROOT = LAUNCHER_ROOT / "app"
# A standalone wgp_config.json (last_model_type pinned to an already-downloaded
# model) so headless runs never inherit whatever model was last picked in the
# Gradio UI -- app/wgp_config.json is left untouched.
CONFIG_PATH = LAUNCHER_ROOT / "generate_config" / "wgp_config.json"
sys.path.insert(0, str(ROOT))

from shared.api import init  # noqa: E402


def parse_args():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--list-models", action="store_true", help="list model_types with local availability and exit")
    parser.add_argument("--model", help="model_type, e.g. z_image, t2v_1.3B, fun_inp_1.3B")
    parser.add_argument("--prompt", help="text prompt")
    parser.add_argument("--negative-prompt", default=None)
    parser.add_argument("--image", help="input image path -> settings['image_start'] (image2video models)")
    parser.add_argument("--resolution", help="e.g. 832x480")
    parser.add_argument("--steps", type=int, help="num_inference_steps override")
    parser.add_argument("--frames", type=int, help="video_length override (video models only)")
    parser.add_argument("--seed", type=int, help="seed override")
    parser.add_argument("--set", action="append", default=[], metavar="KEY=VALUE", help="raw settings override, value parsed as JSON when possible")
    parser.add_argument("--force", action="store_true", help="submit even if the model isn't fully downloaded locally")
    return parser.parse_args()


def main():
    args = parse_args()
    session = init(root=ROOT, config_path=CONFIG_PATH, cli_args=["--attention", "sdpa", "--profile", "4"])

    if args.list_models:
        for record in session.list_model_metadata(include_availability=True):
            availability = record.get("availability", {})
            print(f"{record['model_type']:<28} {availability.get('status', '?'):<10} outputs={record.get('main_output')}")
        return

    if not args.model or not args.prompt:
        print("--model and --prompt are required (or use --list-models)", file=sys.stderr)
        sys.exit(2)

    availability = session.get_model_availability(args.model)
    if not availability.get("available") and not args.force:
        print(f"Model '{args.model}' is not fully downloaded locally (status={availability.get('status')}).", file=sys.stderr)
        print("Disk space on this machine is very tight -- re-run with --force if you really want WanGP to download missing files.", file=sys.stderr)
        sys.exit(1)

    settings = session.get_default_settings(args.model)
    settings["prompt"] = args.prompt
    if args.negative_prompt is not None:
        settings["negative_prompt"] = args.negative_prompt
    if args.image:
        settings["image_start"] = args.image
    if args.resolution:
        settings["resolution"] = args.resolution
    if args.steps is not None:
        settings["num_inference_steps"] = args.steps
    if args.frames is not None:
        settings["video_length"] = args.frames
    if args.seed is not None:
        settings["seed"] = args.seed

    for raw_override in args.set:
        key, _, raw_value = raw_override.partition("=")
        try:
            settings[key] = json.loads(raw_value)
        except json.JSONDecodeError:
            settings[key] = raw_value

    job = session.submit_task(settings)
    result = job.result()

    if result.success:
        for path in result.generated_files:
            print(path)
    else:
        for error in result.errors:
            print(f"ERROR: {getattr(error, 'message', error)}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
