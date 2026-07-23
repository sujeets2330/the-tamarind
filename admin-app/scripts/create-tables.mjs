import mysql from "mysql2/promise"
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

try {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  const envRaw = readFileSync(join(__dirname, "..", ".env"), "utf8")
  for (const line of envRaw.split("\n")) {
    const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/(^["']|["']$)/g, "")
  }
} catch {}

const conn = await mysql.createConnection({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "root123",
  database: process.env.DB_NAME ?? "tamarind_db",
})

console.log('📦 Creating tables...')

await conn.execute(`
  CREATE TABLE IF NOT EXISTS dining_tables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_number INT NOT NULL UNIQUE,
    capacity INT NOT NULL,
    is_available BOOLEAN DEFAULT TRUE
  )
`)
console.log('✅ dining_tables table created')

await conn.execute(`
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (table_id) REFERENCES dining_tables(id)
  )
`)
console.log('✅ bookings table created')

await conn.execute(`
  INSERT IGNORE INTO dining_tables (table_number, capacity) VALUES
  (1, 2), (2, 2), (3, 4), (4, 4), (5, 6), (6, 6), (7, 8), (8, 8)
`)
console.log('✅ Sample tables inserted')

console.log('\n🎉 All tables created successfully!')
await conn.end()