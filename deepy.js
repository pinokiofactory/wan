module.exports = {
    run: [{
        method: "json.set",
        params: {
            "app/wgp_config.json": {
                "enhancer_enabled": 3,
                "deepy_enabled": 1
            }
        }
    }, {
        method: "shell.run",
        params: {
            input: true,
            path: "app",
            venv: "venv",
            message: "python wgp.py --ask-deepy"
        }
    }]
}