import { query } from "./db"
import type { MenuItem } from "./types"
import { SAMPLE_MENU } from "./sample-data"

/**
 * Loads the available menu items from MySQL. If the database can't be
 * reached (for example in the cloud preview), it falls back to sample
 * data so the UI still renders. On your local machine with MySQL running,
 * this returns the real rows.
 */
export async function getMenuItems(): Promise<{ items: MenuItem[]; usingSampleData: boolean }> {
  try {
    const rows = await query<MenuItem>(
      `SELECT id, name, description, price, category, image_url, is_veg, is_available, rating, created_at
       FROM menu_items
       WHERE is_available = 1 AND branch_id = 2
       ORDER BY FIELD(category,'Appetizers','South Indian','Chaat','Main Course','Breads','Desserts','Beverages'), name`,
    )
    const items = rows.map((r) => ({ ...r, price: Number(r.price) }))
    return { items, usingSampleData: false }
  } catch (err) {
    console.log("[v0] menu DB unavailable, using sample data:", (err as Error).message)
    return { items: SAMPLE_MENU, usingSampleData: true }
  }
}

/**
 * Get menu items by branch ID
 */
export async function getMenuItemsByBranch(branchId: number): Promise<{ items: MenuItem[]; usingSampleData: boolean }> {
  try {
    const rows = await query<MenuItem>(
      `SELECT id, name, description, price, category, image_url, is_veg, is_available, rating, created_at
       FROM menu_items
       WHERE is_available = 1 AND branch_id = ?
       ORDER BY FIELD(category,'Appetizers','South Indian','Chaat','Main Course','Breads','Desserts','Beverages'), name`,
      [branchId]
    )
    const items = rows.map((r) => ({ ...r, price: Number(r.price) }))
    return { items, usingSampleData: false }
  } catch (err) {
    console.log("[v0] menu DB unavailable, using sample data:", (err as Error).message)
    return { items: SAMPLE_MENU, usingSampleData: true }
  }
}

/**
 * Get a single menu item by its ID
 */
export async function getMenuItemById(id: number): Promise<MenuItem | null> {
  try {
    const rows = await query<MenuItem>(
      `SELECT id, name, description, price, category, image_url, is_veg, is_available, rating, created_at
       FROM menu_items
       WHERE id = ? AND is_available = 1`,
      [id]
    )
    
    if (rows.length === 0) {
      return null
    }
    
    const item = rows[0]
    return { ...item, price: Number(item.price) }
  } catch (err) {
    console.log("[v0] Error fetching menu item by ID:", (err as Error).message)
    const sampleItem = SAMPLE_MENU.find((item) => item.id === id)
    return sampleItem || null
  }
}

/**
 * Get menu items by category
 */
export async function getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
  try {
    const rows = await query<MenuItem>(
      `SELECT id, name, description, price, category, image_url, is_veg, is_available, rating, created_at
       FROM menu_items
       WHERE category = ? AND is_available = 1
       ORDER BY name`,
      [category]
    )
    return rows.map((r) => ({ ...r, price: Number(r.price) }))
  } catch (err) {
    console.log("[v0] Error fetching menu items by category:", (err as Error).message)
    return SAMPLE_MENU.filter((item) => item.category === category)
  }
}

// Admin functions
export async function createMenuItem(item: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
  const { name, description, price, category, image_url, is_veg, is_available, rating } = item;
  const result = await query(
    'INSERT INTO menu_items (name, description, price, category, image_url, is_veg, is_available, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [name, description, price, category, image_url, is_veg ?? true, is_available ?? true, rating ?? 4.0]
  );
  const insertResult = result as any;
  return insertResult.insertId;
}

export async function updateMenuItem(id: number, item: Partial<MenuItem>): Promise<void> {
  const updates: string[] = [];
  const values: any[] = [];
  
  Object.entries(item).forEach(([key, value]) => {
    if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
      updates.push(`${key} = ?`);
      values.push(value);
    }
  });
  
  values.push(id);
  await query(`UPDATE menu_items SET ${updates.join(', ')} WHERE id = ?`, values);
}

export async function deleteMenuItem(id: number): Promise<void> {
  await query('DELETE FROM menu_items WHERE id = ?', [id]);
}