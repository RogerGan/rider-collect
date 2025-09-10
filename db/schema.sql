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

CREATE TABLE IF NOT EXISTS tickets (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  contact_name VARCHAR(50) NOT NULL,
  contact_phone VARCHAR(20) NOT NULL,
  contact_email VARCHAR(100) DEFAULT '',
  category VARCHAR(30) DEFAULT 'general',
  priority VARCHAR(20) DEFAULT 'normal',
  status VARCHAR(20) DEFAULT 'new',
  admin_reply TEXT,
  is_deleted TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY idx_status (status),
  KEY idx_contact_phone (contact_phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
