import { NextRequest, NextResponse } from 'next/server'
import { getMenuItems, createMenuItem } from '@/lib/db'

export async function GET() {
  try {
    const items = await getMenuItems()
    return NextResponse.json({ items })
  } catch (error) {
    console.error('Error fetching menu:', error)
    return NextResponse.json(
      { message: 'Failed to fetch menu' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, price, category, image_url, is_veg, is_available, branch_id, rating } = body

    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { message: 'Name, description, price, and category are required' },
        { status: 400 }
      )
    }

    const id = await createMenuItem({
      name,
      description,
      price,
      category,
      image_url,
      is_veg,
      is_available,
      branch_id: branch_id || 2,
      rating: rating || 4.0,  // ← ADD THIS LINE
    })

    return NextResponse.json({ 
      success: true, 
      id 
    })
  } catch (error) {
    console.error('Error creating item:', error)
    return NextResponse.json(
      { message: 'Failed to create item' },
      { status: 500 }
    )
  }
}