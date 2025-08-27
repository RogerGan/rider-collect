CREATE DATABASE IF NOT EXISTS rider_collect DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE rider_collect;

CREATE TABLE IF NOT EXISTS riders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  id_number VARCHAR(40) NOT NULL,
  city VARCHAR(50) DEFAULT '',
  address VARCHAR(255) DEFAULT '',
  carrier_pref VARCHAR(20) DEFAULT '',
  vehicle_type VARCHAR(30) DEFAULT '',
  emergency_name VARCHAR(50) DEFAULT '',
  emergency_phone VARCHAR(20) DEFAULT '',
  note VARCHAR(500) DEFAULT '',
  agree TINYINT(1) NOT NULL DEFAULT 0,
  is_deleted TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY idx_phone (phone),
  KEY idx_idn (id_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
