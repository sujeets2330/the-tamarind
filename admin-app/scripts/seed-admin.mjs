import mysql from "mysql2/promise"
import bcrypt from "bcryptjs"

const conn = await mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root123",
  database: "tamarind_db",
})

// Create admins table
await conn.execute(`
  CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`)

const email = "admin@tamarind.com"
const password = "admin123"
const hash = await bcrypt.hash(password, 10)

await conn.execute(
  `INSERT INTO admins (email, password, name) VALUES (?, ?, ?)
   ON DUPLICATE KEY UPDATE password = VALUES(password)`,
  [email, hash, "Admin"]
)

console.log(`\n Admin created!`)
console.log(`   Email: ${email}`)
console.log(`   Password: ${password}`)
console.log(`   http://localhost:3001/login\n`)

await conn.end()