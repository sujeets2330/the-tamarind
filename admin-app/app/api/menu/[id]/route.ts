import { NextRequest, NextResponse } from 'next/server'
import { getMenuItemById, updateMenuItem, deleteMenuItem } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await getMenuItemById(parseInt(params.id))
    if (!item) {
      return NextResponse.json(
        { message: 'Item not found' },
        { status: 404 }
      )
    }
    return NextResponse.json({ item })
  } catch (error) {
    console.error('Error fetching item:', error)
    return NextResponse.json(
      { message: 'Failed to fetch item' },
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
    const id = parseInt(params.id)
    
    const existingItem = await getMenuItemById(id)
    if (!existingItem) {
      return NextResponse.json(
        { message: 'Item not found' },
        { status: 404 }
      )
    }

    const updatedData = {
      name: body.name ?? existingItem.name,
      description: body.description ?? existingItem.description,
      price: body.price ?? existingItem.price,
      category: body.category ?? existingItem.category,
      image_url: body.image_url ?? existingItem.image_url,
      is_veg: body.is_veg !== undefined ? body.is_veg : existingItem.is_veg,
      is_available: body.is_available !== undefined ? body.is_available : existingItem.is_available,
      branch_id: body.branch_id ?? existingItem.branch_id,
      rating: body.rating ?? existingItem.rating ?? 4.0,  // ← ADD THIS LINE
    }

    await updateMenuItem(id, updatedData)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating item:', error)
    return NextResponse.json(
      { message: 'Failed to update item' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const existingItem = await getMenuItemById(id)
    if (!existingItem) {
      return NextResponse.json(
        { message: 'Item not found' },
        { status: 404 }
      )
    }

    await deleteMenuItem(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting item:', error)
    return NextResponse.json(
      { message: 'Failed to delete item' },
      { status: 500 }
    )
  }
}