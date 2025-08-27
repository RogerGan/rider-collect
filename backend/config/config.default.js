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

  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    database: 'rider_collect',
    username: 'root',
    password: '111111',
    timezone: '+08:00',
    define: {
      freezeTableName: true,
      underscored: false,
      timestamps: false,
    },
    dialectOptions: {
      // ensure mysql2 is used and supports MySQL 8 auth
    },
  };

  return config;
};
