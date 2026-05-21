// Конфигурация PM2. Запуск: pm2 start ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: 'wedding',
      script: 'server/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },
  ],
};
