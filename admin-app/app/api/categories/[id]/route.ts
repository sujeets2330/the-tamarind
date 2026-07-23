import { NextRequest, NextResponse } from 'next/server'
import { getCategoryById, updateCategory, deleteCategory } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await getCategoryById(parseInt(params.id))
    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      )
    }
    return NextResponse.json({ category })
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      { message: 'Failed to fetch category' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, description, icon, display_order } = body

    if (!name) {
      return NextResponse.json(
        { message: 'Category name is required' },
        { status: 400 }
      )
    }

    await updateCategory(parseInt(params.id), {
      name,
      description: description || '',
      icon: icon || '',
      display_order: display_order || 0,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { message: 'Failed to update category' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await getCategoryById(parseInt(params.id))
    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      )
    }

    await deleteCategory(parseInt(params.id))
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting category:', error)
    if (error.message.includes('items exist')) {
      return NextResponse.json(
        { message: 'Cannot delete category with existing items' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { message: 'Failed to delete category' },
      { status: 500 }
    )
  }
}