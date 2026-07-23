import crypto from "crypto"

const SECRET = process.env.ADMIN_SESSION_SECRET ?? "change-me-in-env-please"
const MAX_AGE_SECONDS = 60 * 60 * 8 // 8 hours
const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_TIME = 15 * 60 * 1000 // 15 minutes

export const SESSION_COOKIE = "admin_session"

// Store login attempts in memory (use Redis in production)
const loginAttempts = new Map<string, { count: number; lockUntil: number }>()

function sign(payload: string): string {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("hex")
}

export function createToken(adminId: number): string {
  const expiry = Date.now() + MAX_AGE_SECONDS * 1000
  const payload = `${adminId}.${expiry}`
  return `${payload}.${sign(payload)}`
}

export function verifyToken(token: string | undefined | null): number | null {
  if (!token) return null
  
  const parts = token.split(".")
  if (parts.length !== 3) return null
  
  const [adminId, expiry, sig] = parts
  const payload = `${adminId}.${expiry}`
  
  // Verify signature
  const expected = sign(payload)
  if (sig.length !== expected.length) return null
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null
  
  // Check expiry
  if (Date.now() > Number(expiry)) return null
  
  return Number(adminId)
}

export const SESSION_MAX_AGE = MAX_AGE_SECONDS

// Rate limiting for login attempts
export function checkLoginAttempts(email: string): { allowed: boolean; message?: string } {
  const record = loginAttempts.get(email)
  
  if (record) {
    // Check if locked out
    if (record.lockUntil && Date.now() < record.lockUntil) {
      const remaining = Math.ceil((record.lockUntil - Date.now()) / 60000)
      return { 
        allowed: false, 
        message: `Too many failed attempts. Please try again in ${remaining} minutes.` 
      }
    }
    
    // Reset lock if time passed
    if (record.lockUntil && Date.now() > record.lockUntil) {
      loginAttempts.delete(email)
    }
  }
  
  return { allowed: true }
}

export function recordFailedAttempt(email: string): { locked: boolean; message?: string } {
  const record = loginAttempts.get(email)
  
  if (!record) {
    loginAttempts.set(email, { count: 1, lockUntil: 0 })
    return { locked: false }
  }
  
  record.count += 1
  
  if (record.count >= MAX_LOGIN_ATTEMPTS) {
    record.lockUntil = Date.now() + LOCKOUT_TIME
    return { 
      locked: true, 
      message: `Account locked for ${LOCKOUT_TIME / 60000} minutes due to too many failed attempts.` 
    }
  }
  
  return { locked: false }
}

export function clearLoginAttempts(email: string) {
  loginAttempts.delete(email)
}

export async function verifyAdminCredentials(email: string, password: string) {
  const { query } = await import('./db')
  const bcrypt = await import('bcryptjs')
  
  try {
    const rows = await query('SELECT * FROM admins WHERE email = ?', [email])
    const admin = rows[0] as any
    
    if (!admin) {
      return { success: false, message: 'Invalid email or password' }
    }
    
    const isValid = await bcrypt.compare(password, admin.password)
    if (!isValid) {
      return { success: false, message: 'Invalid email or password' }
    }
    
    return { 
      success: true, 
      admin: { id: admin.id, email: admin.email, name: admin.name } 
    }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, message: 'Login failed' }
  }
}