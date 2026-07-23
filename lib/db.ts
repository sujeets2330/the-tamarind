import mysql from "mysql2/promise"

declare global {
  var _mysqlPool: mysql.Pool | undefined
}

// Create a temporary connection without database to check/create database
async function ensureDatabase() {
  const tempPool = mysql.createPool({
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "root123",
    waitForConnections: true,
    connectionLimit: 1,
    queueLimit: 0,
  });

  try {
    const connection = await tempPool.getConnection();
    
    const [rows] = await connection.query(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${process.env.DB_NAME ?? "tamarind_db"}'`
    );
    
    if ((rows as any[]).length === 0) {
      await connection.query(`CREATE DATABASE ${process.env.DB_NAME ?? "tamarind_db"}`);
      console.log('Database "tamarind_db" created successfully');
    }
    
    await connection.query(`USE ${process.env.DB_NAME ?? "tamarind_db"}`);
    
    const [tables] = await connection.query(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'menu_items'`
    );
    
    if ((tables as any[]).length === 0) {
      console.log('Creating menu_items table...');
      
      await connection.query(`
        CREATE TABLE IF NOT EXISTS menu_items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          price DECIMAL(10, 2) NOT NULL,
          category VARCHAR(100) NOT NULL,
          image_url LONGTEXT,
          is_veg BOOLEAN DEFAULT TRUE,
          is_available BOOLEAN DEFAULT TRUE,
          rating DECIMAL(2,1) DEFAULT 4.0,
          branch_id INT DEFAULT 2,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log('Table "menu_items" created successfully');
      
      const [countResult] = await connection.query('SELECT COUNT(*) as count FROM menu_items');
      const count = (countResult as any[])[0].count;
      
      if (count === 0) {
        console.log('Inserting sample data...');
        await connection.query(`
          INSERT INTO menu_items (name, description, price, category, image_url, is_veg, rating, branch_id) VALUES
          ('Paneer Tikka', 'Grilled cottage cheese marinated in aromatic spices with bell peppers', 280.00, 'Appetizers', '', true, 4.5, 2),
          ('Hara Bhara Kabab', 'Green spinach and peas kabab with mint chutney', 250.00, 'Appetizers', '', true, 4.3, 2),
          ('Mushroom Galouti', 'Melt-in-mouth mushroom galouti kebabs with spices', 300.00, 'Appetizers', '', true, 4.4, 2),
          ('Veg Seekh Kabab', 'Minced vegetable kabab with herbs and spices', 260.00, 'Appetizers', '', true, 4.2, 2),
          ('Dahi Ke Sholay', 'Crispy fried paneer and potato rolls with yogurt', 240.00, 'Appetizers', '', true, 4.1, 2),
          ('Aloo Tikki', 'Crispy spiced potato patties with tamarind chutney', 220.00, 'Appetizers', '', true, 4.6, 2),
          ('Masala Dosa', 'Crispy golden dosa with spiced potato filling, served with sambar and chutney', 180.00, 'South Indian', '', true, 4.8, 2),
          ('Plain Dosa', 'Classic crispy dosa with sambar and coconut chutney', 140.00, 'South Indian', '', true, 4.5, 2),
          ('Rava Dosa', 'Crispy semolina dosa with onions and spices', 160.00, 'South Indian', '', true, 4.4, 2),
          ('Idli Sambar', 'Soft steamed rice idlis with flavorful sambar and chutney', 120.00, 'South Indian', '', true, 4.7, 2),
          ('Medu Vada', 'Crispy lentil donuts with sambar and coconut chutney', 110.00, 'South Indian', '', true, 4.3, 2),
          ('Pongal', 'South Indian rice and lentil porridge with ghee and pepper', 130.00, 'South Indian', '', true, 4.2, 2),
          ('Upma', 'Savory semolina porridge with vegetables and peanuts', 100.00, 'South Indian', '', true, 4.1, 2),
          ('Rava Idli', 'Instant semolina idli with vegetables and spices', 110.00, 'South Indian', '', true, 4.0, 2),
          ('Pani Puri', 'Crispy hollow puris filled with spicy mint water and potatoes', 90.00, 'Chaat', '', true, 4.9, 2),
          ('Samosa Chaat', 'Crispy samosa with chickpeas, chutneys and spices', 110.00, 'Chaat', '', true, 4.6, 2),
          ('Bhel Puri', 'Puffed rice with vegetables, chutneys and crispy sev', 80.00, 'Chaat', '', true, 4.4, 2),
          ('Pav Bhaji', 'Spicy vegetable mash served with buttered pav buns', 140.00, 'Chaat', '', true, 4.8, 2),
          ('Chole Bhature', 'Spicy chickpea curry with deep-fried bread', 160.00, 'Chaat', '', true, 4.7, 2),
          ('Dahi Puri', 'Puri topped with potato, sweet yogurt and chutneys', 100.00, 'Chaat', '', true, 4.3, 2),
          ('Aloo Chaat', 'Tangy spiced potato with chutneys and sev', 80.00, 'Chaat', '', true, 4.2, 2),
          ('Kachori Chaat', 'Crispy kachori with potatoes, chutneys and yogurt', 110.00, 'Chaat', '', true, 4.1, 2),
          ('Dal Makhani', 'Slow cooked black lentils with cream and butter', 320.00, 'Main Course', '', true, 4.6, 2),
          ('Paneer Butter Masala', 'Cottage cheese in rich tomato gravy with butter', 350.00, 'Main Course', '', true, 4.7, 2),
          ('Veg Kolhapuri', 'Spicy mixed vegetable curry from Maharashtra', 310.00, 'Main Course', '', true, 4.4, 2),
          ('Kadai Paneer', 'Paneer cooked with bell peppers and aromatic spices', 340.00, 'Main Course', '', true, 4.5, 2),
          ('Shahi Paneer', 'Royal paneer curry in rich creamy gravy', 360.00, 'Main Course', '', true, 4.6, 2),
          ('Malai Kofta', 'Cottage cheese and potato dumplings in creamy gravy', 330.00, 'Main Course', '', true, 4.5, 2),
          ('Veg Biryani', 'Aromatic basmati rice with vegetables and saffron', 290.00, 'Main Course', '', true, 4.8, 2),
          ('Pindi Chole', 'Spicy chickpea curry from Punjab', 280.00, 'Main Course', '', true, 4.3, 2),
          ('Baingan Bharta', 'Smoked eggplant curry with peas', 270.00, 'Main Course', '', true, 4.2, 2),
          ('Mushroom Matar', 'Mushroom and green pea curry in rich gravy', 290.00, 'Main Course', '', true, 4.1, 2),
          ('Garlic Naan', 'Leavened bread with fresh garlic', 65.00, 'Breads', '', true, 4.5, 2),
          ('Butter Naan', 'Leavened bread with butter', 55.00, 'Breads', '', true, 4.4, 2),
          ('Tandoori Roti', 'Whole wheat bread baked in tandoor', 40.00, 'Breads', '', true, 4.3, 2),
          ('Missi Roti', 'Gram flour roti with spices', 50.00, 'Breads', '', true, 4.2, 2),
          ('Lachha Paratha', 'Layered whole wheat paratha', 60.00, 'Breads', '', true, 4.6, 2),
          ('Pudina Paratha', 'Paratha with fresh mint', 55.00, 'Breads', '', true, 4.3, 2),
          ('Stuffed Kulcha', 'Stuffed bread with paneer and spices', 70.00, 'Breads', '', true, 4.4, 2),
          ('Gulab Jamun', 'Sweet milk dumplings in rose sugar syrup', 100.00, 'Desserts', '', true, 4.8, 2),
          ('Rasmalai', 'Cottage cheese dumplings in sweetened thickened milk', 120.00, 'Desserts', '', true, 4.7, 2),
          ('Kulfi', 'Traditional Indian ice cream with cardamom', 110.00, 'Desserts', '', true, 4.6, 2),
          ('Mango Kulfi', 'Mango flavored traditional ice cream', 130.00, 'Desserts', '', true, 4.7, 2),
          ('Gajar Ka Halwa', 'Slow cooked carrot pudding with nuts', 140.00, 'Desserts', '', true, 4.8, 2),
          ('Phirni', 'Creamy rice pudding with cardamom and nuts', 100.00, 'Desserts', '', true, 4.4, 2),
          ('Jalebi', 'Crispy spiral sweets in sugar syrup', 90.00, 'Desserts', '', true, 4.5, 2),
          ('Mango Lassi', 'Sweet yogurt drink with mango pulp', 120.00, 'Beverages', '', true, 4.8, 2),
          ('Masala Chai', 'Traditional spiced Indian tea', 80.00, 'Beverages', '', true, 4.7, 2),
          ('Fresh Lime Soda', 'Fresh lime juice with soda', 90.00, 'Beverages', '', true, 4.4, 2),
          ('Buttermilk', 'Spiced chaas with cumin and mint', 70.00, 'Beverages', '', true, 4.3, 2),
          ('Badam Milk', 'Sweet almond flavored milk', 100.00, 'Beverages', '', true, 4.5, 2),
          ('Fresh Fruit Juice', 'Seasonal fresh fruit juice', 110.00, 'Beverages', '', true, 4.2, 2),
          ('Filter Coffee', 'Traditional South Indian filter coffee', 60.00, 'Beverages', '', true, 4.9, 2)
        `);
        console.log('Sample data inserted successfully (57 items)');
      } else {
        console.log(`Table already has ${count} items, skipping sample data`);
      }
    } else {
      console.log('Table "menu_items" already exists, preserving data');
      
      const [columns] = await connection.query(
        `SELECT DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS 
         WHERE TABLE_NAME = 'menu_items' AND COLUMN_NAME = 'image_url'`
      );
      
      const dataType = (columns as any[])[0]?.DATA_TYPE;
      
      if (dataType && dataType.toUpperCase() !== 'LONGTEXT') {
        console.log(`Converting image_url from ${dataType} to LONGTEXT...`);
        await connection.query(`ALTER TABLE menu_items MODIFY image_url LONGTEXT`);
        console.log('image_url column converted to LONGTEXT');
      }
      
      const [branchColumns] = await connection.query(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
         WHERE TABLE_NAME = 'menu_items' AND COLUMN_NAME = 'branch_id'`
      );
      
      if ((branchColumns as any[]).length === 0) {
        console.log('Adding branch_id column...');
        await connection.query(`ALTER TABLE menu_items ADD COLUMN branch_id INT DEFAULT 2`);
        console.log('branch_id column added');
      }
      
      const [countResult] = await connection.query('SELECT COUNT(*) as count FROM menu_items');
      const count = (countResult as any[])[0].count;
      if (count === 0) {
        console.log('Table is empty, inserting sample data...');
      }
    }
    
    const [diningTables] = await connection.query(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'dining_tables'`
    );
    
    if ((diningTables as any[]).length === 0) {
      console.log('Creating dining_tables table...');
      await connection.query(`
        CREATE TABLE IF NOT EXISTS dining_tables (
          id INT AUTO_INCREMENT PRIMARY KEY,
          table_number INT NOT NULL UNIQUE,
          capacity INT NOT NULL
        )
      `);
      console.log('Table "dining_tables" created successfully');
      
      await connection.query(`
        INSERT INTO dining_tables (table_number, capacity) VALUES
        (1, 2), (2, 2), (3, 4), (4, 4), (5, 6), (6, 6), (7, 8), (8, 8)
      `);
      console.log('Sample tables inserted');
    }
    
    const [bookingsTable] = await connection.query(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'bookings'`
    );
    
    if ((bookingsTable as any[]).length === 0) {
      console.log('Creating bookings table...');
      await connection.query(`
        CREATE TABLE IF NOT EXISTS bookings (
          id INT AUTO_INCREMENT PRIMARY KEY,
          customer_name VARCHAR(100) NOT NULL,
          mobile VARCHAR(15) NOT NULL,
          city VARCHAR(100) NOT NULL,
          members INT NOT NULL,
          booking_date DATE NOT NULL,
          slot VARCHAR(50) NOT NULL,
          table_id INT,
          status VARCHAR(20) DEFAULT 'confirmed',
          branch_id INT DEFAULT 2,
          branch_name VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Table "bookings" created successfully');
    } else {
      const [branchCol] = await connection.query(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
         WHERE TABLE_NAME = 'bookings' AND COLUMN_NAME = 'branch_id'`
      );
      
      if ((branchCol as any[]).length === 0) {
        console.log('Adding branch_id to bookings table...');
        await connection.query(`ALTER TABLE bookings ADD COLUMN branch_id INT DEFAULT 2`);
        await connection.query(`ALTER TABLE bookings ADD COLUMN branch_name VARCHAR(100)`);
        console.log('branch columns added to bookings');
      }
    }
    
    const [branchesTable] = await connection.query(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'branches'`
    );
    
    if ((branchesTable as any[]).length === 0) {
      console.log('Creating branches table...');
      await connection.query(`
        CREATE TABLE IF NOT EXISTS branches (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Table "branches" created successfully');
      
      await connection.query(`
        INSERT INTO branches (id, name, description) VALUES 
        (1, 'Tamarind Branch 1', 'Branch 1 location'),
        (2, 'Tamarind Branch 2', 'Branch 2 location')
      `);
      console.log('Branches inserted');
    }
    
    connection.release();
  } catch (error) {
    console.error('Error ensuring database exists:', error);
  } finally {
    await tempPool.end();
  }
}

function createPool() {
  if (typeof window === 'undefined') {
    ensureDatabase().catch(console.error);
  }
  
  return mysql.createPool({
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "root123",
    database: process.env.DB_NAME ?? "tamarind_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true,
  })
}

export const pool = global._mysqlPool ?? createPool()
if (process.env.NODE_ENV !== "production") global._mysqlPool = pool

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  try {
    const [rows] = await pool.execute(sql, params)
    return rows as T[]
  } catch (error: any) {
    if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('Database not found, retrying connection...');
      await ensureDatabase();
      const [rows] = await pool.execute(sql, params);
      return rows as T[];
    }
    throw error;
  }
}

// ============ BOOKING FUNCTIONS ============

export async function createBooking(data: any) {
  const { customer_name, mobile, city, members, booking_date, slot, branch_id, branch_name } = data
  
  const [tables] = await pool.execute(
    `SELECT id, table_number, capacity FROM dining_tables ORDER BY RAND() LIMIT 1`
  )
  
  const table = (tables as any[])[0]
  
  if (!table) {
    const [result] = await pool.execute(
      `INSERT INTO dining_tables (table_number, capacity) VALUES (1, 4)`
    )
    const tableId = (result as any).insertId
    const [newTable] = await pool.execute(
      `SELECT id, table_number, capacity FROM dining_tables WHERE id = ?`,
      [tableId]
    )
    const tableData = (newTable as any[])[0]
    
    const [bookingResult] = await pool.execute(
      `INSERT INTO bookings (customer_name, mobile, city, members, booking_date, slot, table_id, status, branch_id, branch_name)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed', ?, ?)`,
      [customer_name, mobile, city, members, booking_date, slot, tableData.id, branch_id || 2, branch_name || 'Tamarind Branch 2']
    )
    
    const bookingId = (bookingResult as any).insertId
    
    return {
      id: bookingId,
      customer_name,
      mobile,
      city,
      members,
      booking_date,
      slot,
      table_number: tableData.table_number,
      table_capacity: tableData.capacity,
      branch_id: branch_id || 2,
      branch_name: branch_name || 'Tamarind Branch 2'
    }
  }
  
  const [result] = await pool.execute(
    `INSERT INTO bookings (customer_name, mobile, city, members, booking_date, slot, table_id, status, branch_id, branch_name)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed', ?, ?)`,
    [customer_name, mobile, city, members, booking_date, slot, table.id, branch_id || 2, branch_name || 'Tamarind Branch 2']
  )
  
  const bookingId = (result as any).insertId
  
  return {
    id: bookingId,
    customer_name,
    mobile,
    city,
    members,
    booking_date,
    slot,
    table_number: table.table_number,
    table_capacity: table.capacity,
    branch_id: branch_id || 2,
    branch_name: branch_name || 'Tamarind Branch 2'
  }
}

export async function getBookings() {
  const [rows] = await pool.execute(
    `SELECT b.*, t.table_number 
     FROM bookings b
     LEFT JOIN dining_tables t ON t.id = b.table_id
     ORDER BY b.created_at DESC`
  )
  return rows
}

export async function deleteBooking(id: number) {
  await pool.execute(
    `DELETE FROM bookings WHERE id = ?`,
    [id]
  )
}

// ============ CATEGORY FUNCTIONS ============

export async function getCategories() {
  const [rows] = await pool.execute(
    `SELECT * FROM categories ORDER BY display_order, name`
  )
  return rows
}

// ============ BRANCH FUNCTIONS ============

export async function getMenuItemsByBranch(branchId: number) {
  const [rows] = await pool.execute(
    `SELECT * FROM menu_items WHERE is_available = 1 AND branch_id = ? ORDER BY category, name`,
    [branchId]
  )
  return rows
}

export async function getBranches() {
  const [rows] = await pool.execute(
    `SELECT * FROM branches ORDER BY id`
  )
  return rows
}