module.exports = appInfo => {
  const config = {};

  config.keys = appInfo.name + '_rider_collect_secret';

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.cors = {
    origin: ctx => ctx.get('origin') || '*',
    credentials: true,
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };

  config.mysql = {
    client: {
      host: '127.0.0.1',
      port: '3306',
      user: 'root',
      password: '111111',
      database: 'rider_collect',
    },
    app: true,
    agent: false,
  };

  return config;
};
