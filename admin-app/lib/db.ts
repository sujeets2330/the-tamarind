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
      console.log('✅ Database "tamarind_db" created successfully');
    }
    
    await connection.query(`USE ${process.env.DB_NAME ?? "tamarind_db"}`);
    
    const [tables] = await connection.query(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'menu_items'`
    );
    
    if ((tables as any[]).length === 0) {
      console.log('📦 Creating menu_items table...');
      
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
      console.log('✅ Table "menu_items" created successfully');
      
      const [countResult] = await connection.query('SELECT COUNT(*) as count FROM menu_items');
      const count = (countResult as any[])[0].count;
      
      if (count === 0) {
        console.log('📦 Inserting sample data...');
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
        console.log('✅ Sample data inserted successfully (57 items)');
      } else {
        console.log(`✅ Table already has ${count} items, skipping sample data`);
      }
    } else {
      console.log('✅ Table "menu_items" already exists, preserving data');
      
      const [columns] = await connection.query(
        `SELECT DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS 
         WHERE TABLE_NAME = 'menu_items' AND COLUMN_NAME = 'image_url'`
      );
      
      const dataType = (columns as any[])[0]?.DATA_TYPE;
      
      if (dataType && dataType.toUpperCase() !== 'LONGTEXT') {
        console.log(`📦 Converting image_url from ${dataType} to LONGTEXT...`);
        await connection.query(`ALTER TABLE menu_items MODIFY image_url LONGTEXT`);
        console.log('✅ image_url column converted to LONGTEXT');
      }
      
      const [branchColumns] = await connection.query(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
         WHERE TABLE_NAME = 'menu_items' AND COLUMN_NAME = 'branch_id'`
      );
      
      if ((branchColumns as any[]).length === 0) {
        console.log('📦 Adding branch_id column...');
        await connection.query(`ALTER TABLE menu_items ADD COLUMN branch_id INT DEFAULT 2`);
        console.log('✅ branch_id column added');
      }
      
      const [countResult] = await connection.query('SELECT COUNT(*) as count FROM menu_items');
      const count = (countResult as any[])[0].count;
      if (count === 0) {
        console.log('📦 Table is empty, inserting sample data...');
      }
    }
    
    const [branchesTable] = await connection.query(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'branches'`
    );
    
    if ((branchesTable as any[]).length === 0) {
      console.log('📦 Creating branches table...');
      await connection.query(`
        CREATE TABLE IF NOT EXISTS branches (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Table "branches" created successfully');
      
      await connection.query(`
        INSERT INTO branches (id, name, description) VALUES 
        (1, 'Tamarind Branch 1', 'Branch 1 location'),
        (2, 'Tamarind Branch 2', 'Branch 2 location')
      `);
      console.log('✅ Branches inserted');
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

// ============ MENU FUNCTIONS ============

export async function getMenuItems() {
  return await query('SELECT * FROM menu_items ORDER BY category, name')
}

export async function getMenuItemById(id: number) {
  const rows = await query('SELECT * FROM menu_items WHERE id = ?', [id])
  return rows[0] || null
}

export async function createMenuItem(data: any) {
  const { name, description, price, category, image_url, is_veg, is_available, branch_id, rating } = data
  const cleanName = name?.trim() || ''
  const cleanDescription = description?.trim() || ''
  const cleanPrice = price || 0
  const cleanCategory = category?.trim() || ''
  const cleanImageUrl = image_url || null
  const cleanIsVeg = is_veg !== undefined ? (is_veg ? 1 : 0) : 1
  const cleanIsAvailable = is_available !== undefined ? (is_available ? 1 : 0) : 1
  const cleanBranchId = branch_id || 2
  const cleanRating = rating || 4.0

  const result = await query(
    `INSERT INTO menu_items (name, description, price, category, image_url, is_veg, is_available, branch_id, rating)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [cleanName, cleanDescription, cleanPrice, cleanCategory, cleanImageUrl, cleanIsVeg, cleanIsAvailable, cleanBranchId, cleanRating]
  )
  return (result as any).insertId
}

export async function updateMenuItem(id: number, data: any) {
  const { name, description, price, category, image_url, is_veg, is_available, branch_id, rating } = data
  const cleanName = name?.trim() || ''
  const cleanDescription = description?.trim() || ''
  const cleanPrice = price || 0
  const cleanCategory = category?.trim() || ''
  const cleanImageUrl = image_url || null
  const cleanIsVeg = is_veg !== undefined ? (is_veg ? 1 : 0) : 1
  const cleanIsAvailable = is_available !== undefined ? (is_available ? 1 : 0) : 1
  const cleanBranchId = branch_id || 2
  const cleanRating = rating || 4.0

  await query(
    `UPDATE menu_items 
     SET name = ?, description = ?, price = ?, category = ?, 
         image_url = ?, is_veg = ?, is_available = ?, branch_id = ?, rating = ?
     WHERE id = ?`,
    [cleanName, cleanDescription, cleanPrice, cleanCategory, cleanImageUrl, cleanIsVeg, cleanIsAvailable, cleanBranchId, cleanRating, id]
  )
}

export async function deleteMenuItem(id: number) {
  await query('DELETE FROM menu_items WHERE id = ?', [id])
}

// ============ BOOKING FUNCTIONS ============

export async function getBookings() {
  return await query(
    `SELECT b.*, t.table_number 
     FROM bookings b
     LEFT JOIN dining_tables t ON t.id = b.table_id
     ORDER BY b.created_at DESC`
  )
}

export async function deleteBooking(id: number) {
  const rows = await query('SELECT table_id FROM bookings WHERE id = ?', [id])
  const booking = rows[0] as any
  
  if (booking) {
    await query('UPDATE dining_tables SET is_available = 1 WHERE id = ?', [booking.table_id])
  }
  
  await query('DELETE FROM bookings WHERE id = ?', [id])
}

// ============ CATEGORY FUNCTIONS ============

export async function getCategories() {
  return await query('SELECT * FROM categories ORDER BY display_order, name')
}

export async function getCategoryById(id: number) {
  const rows = await query('SELECT * FROM categories WHERE id = ?', [id])
  return rows[0] || null
}

export async function createCategory(data: any) {
  const { name, description, icon, display_order } = data
  const cleanName = name?.trim() || ''
  const cleanDescription = description?.trim() || ''
  const cleanIcon = icon?.trim() || ''
  const cleanDisplayOrder = display_order || 0

  const result = await query(
    `INSERT INTO categories (name, description, icon, display_order)
     VALUES (?, ?, ?, ?)`,
    [cleanName, cleanDescription, cleanIcon, cleanDisplayOrder]
  )
  return (result as any).insertId
}

export async function updateCategory(id: number, data: any) {
  const { name, description, icon, display_order } = data
  const cleanName = name?.trim() || ''
  const cleanDescription = description?.trim() || ''
  const cleanIcon = icon?.trim() || ''
  const cleanDisplayOrder = display_order || 0

  await query(
    `UPDATE categories 
     SET name = ?, description = ?, icon = ?, display_order = ?
     WHERE id = ?`,
    [cleanName, cleanDescription, cleanIcon, cleanDisplayOrder, id]
  )
}

export async function deleteCategory(id: number) {
  const items = await query('SELECT COUNT(*) as count FROM menu_items WHERE category = (SELECT name FROM categories WHERE id = ?)', [id])
  const count = (items as any[])[0]?.count || 0
  
  if (count > 0) {
    throw new Error('Cannot delete category with existing items')
  }
  
  await query('DELETE FROM categories WHERE id = ?', [id])
}