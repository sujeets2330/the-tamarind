import { NextRequest, NextResponse } from 'next/server'
import { getBookings, deleteBooking } from '@/lib/db'

export async function GET() {
  try {
    const bookings = await getBookings()
    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { message: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { message: 'Booking ID is required' },
        { status: 400 }
      )
    }
    
    await deleteBooking(parseInt(id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting booking:', error)
    return NextResponse.json(
      { message: 'Failed to delete booking' },
      { status: 500 }
    )
  }
}