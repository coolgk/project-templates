module.exports = {
  apps: [
    {
      name: 'express-app',
      script: './dist/src/server.js',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      instances: -1,
      exec_mode: 'cluster',
      max_memory_restart: '500M',
      env: {
        NODE_PATH: './dist'
      },
      error_file: './logs/pm2.error.log',
      out_file: './logs/pm2.out.log',
      max_restarts: 10
      // restart_delay: 1000
    }
  ]
};
