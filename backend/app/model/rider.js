'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, TEXT } = app.Sequelize;
  const Rider = app.model.define('riders', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: STRING(50),
    phone: STRING(20),
    id_number: STRING(50),
    city: STRING(50),
    address: STRING(255),
    carrier_pref: STRING(20),
    vehicle_type: STRING(20),
    emergency_name: STRING(50),
    emergency_phone: STRING(20),
    note: TEXT,
    agree: INTEGER,
    status: STRING(20),
    shipping_status: STRING(20),
    logistics_status: STRING(30),
    created_at: DATE,
    updated_at: DATE,
    is_deleted: INTEGER,
  }, {
    timestamps: false,
  });
  return Rider;
};


