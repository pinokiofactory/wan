module.exports = {
  run: [{
    when: "{{gpu === 'nvidia' && gpu_driver && Number.parseFloat(gpu_driver) < 580 && !(kernel.gpu_model && / (10|16)\\d+/.test(kernel.gpu_model))}}",
    method: "notify",
    params: {
      html: "Your NVIDIA driver ({{gpu_driver}}) is too old for CUDA 13. Update to R580 or newer, then run Update again."
    },
    next: null
  }, {
    method: "shell.run",
    params: {
      message: "git pull"
    }
  }, {
    method: "shell.run",
    params: {
      path: "app",
      message: "git pull"
    }
  }, {
    when: "{{exists('app/env')}}",
    method: "fs.rm",
    params: {
      path: "app/env"
    }
  }, {
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
  }, {
    method: "shell.run",
    params: {
      venv: "venv",
      path: "app",
      message: [
        "uv pip install -r requirements.txt --index-strategy unsafe-best-match",
        "uv pip install comtypes"
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
  }]
}
