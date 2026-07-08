"""Pinokio entrypoint: run Wan2GP without Gradio's flaky localhost HEAD check."""
from __future__ import annotations

import os
import runpy
import sys
import time
import warnings
from pathlib import Path

import httpx
import gradio.networking as networking

APP_DIR = Path(__file__).resolve().parent / "app"


def _url_ok_pinokio(url: str) -> bool:
    if "127.0.0.1" in url or "localhost" in url:
        try:
            for _ in range(5):
                with warnings.catch_warnings():
                    warnings.filterwarnings("ignore")
                    response = httpx.get(url, timeout=3, verify=False, trust_env=False)
                if response.status_code in (200, 401, 302, 303, 307):
                    return True
                time.sleep(0.5)
        except (ConnectionError, httpx.ConnectError, httpx.TimeoutException):
            pass
        # Gradio already bound the port; HEAD checks are unreliable on Windows.
        return True
    return networking.url_ok.__wrapped__(url) if hasattr(networking.url_ok, "__wrapped__") else False


_orig_url_ok = networking.url_ok
_url_ok_pinokio.__wrapped__ = _orig_url_ok  # type: ignore[attr-defined]
networking.url_ok = _url_ok_pinokio

os.chdir(APP_DIR)
sys.argv[0] = str(APP_DIR / "wgp.py")
runpy.run_path("wgp.py", run_name="__main__")
