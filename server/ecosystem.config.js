module.exports = {
  apps: [
    {
      name: "CAKE-DENIM",
      script: "npm",
      args: "run dev",
      env: {
        NODE_ENV: "development",
        ENV_VAR1: "environment-variable",
      },
    },
  ],
};
