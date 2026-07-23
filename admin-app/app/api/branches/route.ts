import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const branches = await query('SELECT * FROM branches ORDER BY id')
    return NextResponse.json({ branches })
  } catch (error) {
    console.error('Error fetching branches:', error)
    return NextResponse.json(
      { message: 'Failed to fetch branches' },
      { status: 500 }
    )
  }
}