module.exports = async (kernel) => {
  let port = await kernel.port()
  return {
    requires: {
      bundle: "ai",
    },
    daemon: true,
    run: [
      {
        method: "shell.run",
        params: {
          venv: "app/env",
          env: {
            SERVER_NAME: "127.0.0.1",
            SERVER_PORT: port,
            GRADIO_SERVER_NAME: "127.0.0.1",
            GRADIO_SERVER_PORT: `${port}`,
            NO_PROXY: "127.0.0.1,localhost,*.localhost",
            no_proxy: "127.0.0.1,localhost,*.localhost",
            HTTP_PROXY: "",
            HTTPS_PROXY: "",
          },
          path: ".",
          message: [
            "python launch_wgp.py --multiple-images --profile 4 --attention sdpa --fp16 --perc-reserved-mem-max 0.3 --preload 0 {{args.compile ? '--compile' : ''}}"
          ],
          on: [{
            event: "/(http:\\/\\/[0-9.:]+)/",
            done: true
          }]
        }
      },
      {
        method: "local.set",
        params: {
          url: "{{input.event[1]}}"
        }
      }
    ]
  }
}
