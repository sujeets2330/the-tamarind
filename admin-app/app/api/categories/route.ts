import { NextRequest, NextResponse } from 'next/server'
import { getCategories, createCategory } from '@/lib/db'

export async function GET() {
  try {
    const categories = await getCategories()
    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { message: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, icon, display_order } = body

    if (!name) {
      return NextResponse.json(
        { message: 'Category name is required' },
        { status: 400 }
      )
    }

    const id = await createCategory({
      name,
      description: description || '',
      icon: icon || '',
      display_order: display_order || 0,
    })

    return NextResponse.json({ 
      success: true, 
      id 
    })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { message: 'Failed to create category' },
      { status: 500 }
    )
  }
}