module.exports = {
  run: [
    // nvidia 50 series windows
    {
      "when": "{{platform === 'win32' && gpu === 'nvidia' && kernel.gpu_model && / 50.+/.test(kernel.gpu_model) }}",
      "method": "shell.run",
      "params": {
        "venv": "{{args && args.venv ? args.venv : null}}",
        "path": "{{args && args.path ? args.path : '.'}}",
        "message": [
          'uv pip install torch==2.7.1 torchvision torchaudio --index-url https://download.pytorch.org/whl/cu128',
          "uv pip install triton-windows",
          "uv pip install https://github.com/woct0rdho/SageAttention/releases/download/v2.1.1-windows/sageattention-2.1.1+cu128torch2.7.1-cp310-cp310-win_amd64.whl", 
//          "uv pip install https://github.com/woct0rdho/triton-windows/releases/download/v3.2.0-windows.post9/triton-3.2.0-cp310-cp310-win_amd64.whl",
//          "uv pip install https://github.com/deepbeepmeep/SageAttention/raw/refs/heads/main/releases/sageattention-2.1.0-cp310-cp310-win_amd64.whl"
        ]
      },
      "next": null
    },
    // nvidia 50 series linux
    {
      "when": "{{platform === 'linux' && gpu === 'nvidia' && kernel.gpu_model && / 50.+/.test(kernel.gpu_model) }}",
      "method": "shell.run",
      "params": {
        "venv": "{{args && args.venv ? args.venv : null}}",
        "path": "{{args && args.path ? args.path : '.'}}",
        "message": [
          'uv pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu128',
          "uv pip install git+https://github.com/thu-ml/SageAttention.git",
//          "uv pip install https://github.com/woct0rdho/triton-windows/releases/download/v3.2.0-windows.post9/triton-3.2.0-cp310-cp310-win_amd64.whl",
//          "uv pip install https://github.com/deepbeepmeep/SageAttention/raw/refs/heads/main/releases/sageattention-2.1.0-cp310-cp310-win_amd64.whl"
        ]
      },
      "next": null
    },
    // windows nvidia
    {
      "when": "{{platform === 'win32' && gpu === 'nvidia'}}",
      "method": "shell.run",
      "params": {
        "venv": "{{args && args.venv ? args.venv : null}}",
        "path": "{{args && args.path ? args.path : '.'}}",
        "message": [
          //"uv pip install torch==2.5.1 torchvision==0.20.1 torchaudio==2.5.1 {{args && args.xformers ? 'xformers' : ''}}  --index-url https://download.pytorch.org/whl/cu121 --force-reinstall",
          "uv pip install torch==2.6.0 torchvision torchaudio {{args && args.xformers ? 'xformers' : ''}}  --index-url https://download.pytorch.org/whl/cu124 --force-reinstall",
          //"uv pip install https://github.com/bdashore3/flash-attention/releases/download/v2.7.1.post1/flash_attn-2.7.1.post1+cu124torch2.5.1cxx11abiFALSE-cp310-cp310-win_amd64.whl"
          //"uv pip install https://github.com/PrashantSaikia/Triton-for-Windows/raw/refs/heads/main/triton-2.0.0-cp310-cp310-win_amd64.whl"
          //"uv pip install https://github.com/woct0rdho/triton-windows/releases/download/v3.2.0-windows.post9/triton-3.2.0-cp310-cp310-win_amd64.whl"
          //"uv pip install https://github.com/woct0rdho/triton-windows/releases/download/v3.1.0-windows.post8/triton-3.1.0-cp310-cp310-win_amd64.whl",
          "uv pip install https://github.com/woct0rdho/triton-windows/releases/download/v3.2.0-windows.post9/triton-3.2.0-cp310-cp310-win_amd64.whl",
          //"uv pip install sageattention",
          //"uv pip install https://github.com/sdbds/SageAttention-for-windows/releases/download/2.0.1/sageattention-2.0.1+cu124torch2.5.1-cp310-cp310-win_amd64.whl",
          "uv pip install https://github.com/deepbeepmeep/SageAttention/raw/refs/heads/main/releases/sageattention-2.1.0-cp310-cp310-win_amd64.whl"
          //"uv pip install https://download.pytorch.org/whl/cu121/xformers-0.0.27.post2-cp310-cp310-win_amd64.whl"
        ]
      }
    },
    // windows amd
    {
      "when": "{{platform === 'win32' && gpu === 'amd'}}",
      "method": "shell.run",
      "params": {
        "venv": "{{args && args.venv ? args.venv : null}}",
        "path": "{{args && args.path ? args.path : '.'}}",
        "message": "uv pip install torch-directml torchaudio torchvision numpy==1.26.4"
      }
    },
    // windows cpu
    {
      "when": "{{platform === 'win32' && (gpu !== 'nvidia' && gpu !== 'amd')}}",
      "method": "shell.run",
      "params": {
        "venv": "{{args && args.venv ? args.venv : null}}",
        "path": "{{args && args.path ? args.path : '.'}}",
        "message": "uv pip install torch==2.5.1 torchvision==0.20.1 torchaudio==2.5.1"
      }
    },
    // mac
    {
      "when": "{{platform === 'darwin'}}",
      "method": "shell.run",
      "params": {
        "venv": "{{args && args.venv ? args.venv : null}}",
        "path": "{{args && args.path ? args.path : '.'}}",
        "message": "uv pip install torch==2.5.1 torchvision==0.20.1 torchaudio==2.5.1"
      }
    },
    // linux nvidia
    {
      "when": "{{platform === 'linux' && gpu === 'nvidia'}}",
      "method": "shell.run",
      "params": {
        "venv": "{{args && args.venv ? args.venv : null}}",
        "path": "{{args && args.path ? args.path : '.'}}",
        "message": [
          //"uv pip install torch==2.5.1 torchvision==0.20.1 torchaudio==2.5.1 {{args && args.xformers ? 'xformers' : ''}}  --index-url https://download.pytorch.org/whl/cu121 --force-reinstall",
          "uv pip install torch==2.6.0 torchvision torchaudio {{args && args.xformers ? 'xformers' : ''}}  --index-url https://download.pytorch.org/whl/cu124 --force-reinstall",
          //"uv pip install git+https://github.com/Dao-AILab/flash-attention.git@v2.6.3"
          //"uv pip install git+https://github.com/thu-ml/SageAttention",
          "uv pip install sageattention==1.0.6",
          "uv pip install triton",
          //"uv pip install https://download.pytorch.org/whl/cu121/xformers-0.0.27.post2-cp310-cp310-manylinux2014_x86_64.whl"
        ]
      }
    },
    // linux rocm (amd)
    {
      "when": "{{platform === 'linux' && gpu === 'amd'}}",
      "method": "shell.run",
      "params": {
        "venv": "{{args && args.venv ? args.venv : null}}",
        "path": "{{args && args.path ? args.path : '.'}}",
        "message": "uv pip install torch==2.5.1 torchvision==0.20.1 torchaudio==2.5.1 --index-url https://download.pytorch.org/whl/rocm6.2"
      }
    },
    // linux cpu
    {
      "when": "{{platform === 'linux' && (gpu !== 'amd' && gpu !=='nvidia')}}",
      "method": "shell.run",
      "params": {
        "venv": "{{args && args.venv ? args.venv : null}}",
        "path": "{{args && args.path ? args.path : '.'}}",
        "message": "uv pip install torch==2.5.1 torchvision==0.20.1 torchaudio==2.5.1 --index-url https://download.pytorch.org/whl/cpu"
      }
    }
  ]
}
