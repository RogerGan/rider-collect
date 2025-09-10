'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, TEXT } = app.Sequelize;
  const Ticket = app.model.define('tickets', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    title: STRING(100),
    description: TEXT,
    contact_name: STRING(50),
    contact_phone: STRING(20),
    contact_email: STRING(100),
    category: STRING(30),
    priority: STRING(20),
    status: STRING(20),
    admin_reply: TEXT,
    created_at: DATE,
    updated_at: DATE,
    is_deleted: INTEGER,
  }, {
    timestamps: false,
  });
  return Ticket;
};
