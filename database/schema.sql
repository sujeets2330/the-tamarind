-- =====================================================================
--  SPICE ROUTE  —  Hotel / Restaurant  •  MySQL schema + seed data
--  Run this once in MySQL Workbench or the mysql CLI to create everything.
--
--  PowerShell (from the mysql CLI):
--    mysql -u root -p < database/schema.sql
-- =====================================================================

CREATE DATABASE IF NOT EXISTS spice_route
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE spice_route;

-- ---------------------------------------------------------------------
--  MENU ITEMS  (shown on the customer site, managed later from admin)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS menu_items (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(150)   NOT NULL,
  description  VARCHAR(500)   NOT NULL DEFAULT '',
  price        DECIMAL(10,2)  NOT NULL,
  category     VARCHAR(60)    NOT NULL,           -- Starters / Main Course / Breads / Desserts / Beverages
  image_url    VARCHAR(500)   NOT NULL DEFAULT '',-- Cloudinary URL
  is_veg       TINYINT(1)     NOT NULL DEFAULT 1,
  is_available TINYINT(1)     NOT NULL DEFAULT 1,
  created_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
--  TABLES  (physical dining tables — used to auto-assign a booking)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dining_tables (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  table_number  INT          NOT NULL UNIQUE,
  capacity      INT          NOT NULL,            -- max people this table seats
  is_active     TINYINT(1)   NOT NULL DEFAULT 1
);

-- ---------------------------------------------------------------------
--  BOOKINGS  (table reservations placed by customers)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  customer_name  VARCHAR(120)  NOT NULL,
  mobile         VARCHAR(20)   NOT NULL,          -- compulsory
  city           VARCHAR(80)   NOT NULL,
  members        INT           NOT NULL,
  booking_date   DATE          NOT NULL,
  slot           VARCHAR(40)    NOT NULL,          -- e.g. "07:00 PM - 09:00 PM"
  table_id       INT           NULL,
  status         VARCHAR(20)   NOT NULL DEFAULT 'confirmed', -- confirmed / cancelled / completed
  created_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_booking_table FOREIGN KEY (table_id)
    REFERENCES dining_tables (id) ON DELETE SET NULL,
  -- One physical table cannot be double-booked for the same date + slot
  UNIQUE KEY uq_table_slot (table_id, booking_date, slot)
);

-- ---------------------------------------------------------------------
--  ADMINS  (login for the separate admin app on port 3001)
--  NOTE: passwords are bcrypt-hashed. Seed via:  npm run seed:admin
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admins (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  email       VARCHAR(150)  NOT NULL UNIQUE,
  password    VARCHAR(255)  NOT NULL,             -- bcrypt hash
  name        VARCHAR(120)  NOT NULL DEFAULT 'Admin',
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
--  SEED DATA
-- =====================================================================

-- Dining tables (mix of capacities so the booking engine can match party size)
INSERT INTO dining_tables (table_number, capacity) VALUES
  (1, 2), (2, 2), (3, 4), (4, 4), (5, 4),
  (6, 6), (7, 6), (8, 8), (9, 10), (10, 12)
ON DUPLICATE KEY UPDATE capacity = VALUES(capacity);

-- Menu items (images left blank — upload via Cloudinary and paste URLs from admin later)
INSERT INTO menu_items (name, description, price, category, is_veg, image_url) VALUES
  ('Paneer Tikka',        'Char-grilled cottage cheese marinated in spiced yogurt.',            320.00, 'Starters',    1, ''),
  ('Chicken 65',          'Crispy fried chicken tossed with curry leaves and chillies.',        360.00, 'Starters',    0, ''),
  ('Veg Spring Rolls',    'Golden rolls stuffed with fresh vegetables and herbs.',              240.00, 'Starters',    1, ''),
  ('Butter Chicken',      'Tandoori chicken simmered in a rich tomato-butter gravy.',           420.00, 'Main Course', 0, ''),
  ('Paneer Butter Masala','Cottage cheese in a creamy cashew-tomato gravy.',                    360.00, 'Main Course', 1, ''),
  ('Dal Makhani',         'Slow-cooked black lentils finished with cream and butter.',          290.00, 'Main Course', 1, ''),
  ('Hyderabadi Biryani',  'Fragrant basmati rice layered with spiced meat and saffron.',        380.00, 'Main Course', 0, ''),
  ('Garlic Naan',         'Soft tandoor bread topped with garlic and butter.',                   70.00, 'Breads',      1, ''),
  ('Tandoori Roti',       'Whole-wheat flatbread baked in the clay oven.',                       35.00, 'Breads',      1, ''),
  ('Gulab Jamun',         'Warm milk dumplings soaked in rose-cardamom syrup.',                 160.00, 'Desserts',    1, ''),
  ('Gajar Ka Halwa',      'Slow-cooked carrot pudding with nuts and ghee.',                     180.00, 'Desserts',    1, ''),
  ('Masala Chai',         'Spiced Indian tea brewed with milk.',                                 60.00, 'Beverages',   1, ''),
  ('Fresh Lime Soda',     'Chilled sparkling lime, sweet or salted.',                            90.00, 'Beverages',   1, '');
