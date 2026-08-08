module.exports = {
  requires: {
    bundle: "ai"
  },
  run: [
    {
      when: "{{gpu === 'nvidia' && gpu_driver && Number.parseFloat(gpu_driver) < 580 && !(kernel.gpu_model && / (10|16)\\d+/.test(kernel.gpu_model))}}",
      method: "notify",
      params: {
        html: "Your NVIDIA driver ({{gpu_driver}}) is too old for CUDA 13. Update to R580 or newer, then run Install again."
      },
      next: null
    },
    {
      when: "{{exists('app/env')}}",
      method: "fs.rm",
      params: {
        path: "app/env"
      }
    },
    {
      when: "{{!exists('app')}}",
      method: "shell.run",
      params: {
        message: "git clone https://github.com/deepbeepmeep/Wan2GP app"
      }
    },
    {
      method: "script.start",
      params: {
        uri: "torch.js",
        params: {
          venv_python: "3.11",
          venv: "venv",
          path: "app",
          xformers: true
        }
      }
    },
    {
      method: "shell.run",
      params: {
        venv: "venv",
        path: "app",
        message: [
          "uv pip install -r requirements.txt --index-strategy unsafe-best-match",
          "uv pip install hf-xet pip comtypes"
        ]
      }
    },
    {
      when: "{{platform === 'win32' && gpu === 'amd'}}",
      method: "shell.run",
      params: {
        venv: "venv",
        path: "app",
        message: "uv pip install numpy==1.26.4"
      }
    },
    {
      method: "notify",
      params: {
        html: "Installation completed"
      }
    }
  ]
}
