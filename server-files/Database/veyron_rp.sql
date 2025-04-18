-- Tabelle: accounts
CREATE TABLE accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  socialclub VARCHAR(100) UNIQUE,
  username VARCHAR(50),
  discord_id VARCHAR(50) DEFAULT NULL,
  admin_level INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


-- Tabelle: player_inventory
CREATE TABLE player_inventory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  player_social VARCHAR(100),
  item_name VARCHAR(100),
  item_image VARCHAR(255),
  quantity INT DEFAULT 1
);

-- Tabelle: anticheat_logs (optional)
CREATE TABLE anticheat_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  player_social VARCHAR(100),
  reason VARCHAR(255),
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
