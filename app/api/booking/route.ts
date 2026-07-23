import { NextRequest, NextResponse } from 'next/server'
import { createBooking } from '@/lib/db'
import { sendBookingNotifications } from '@/lib/sms'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer_name, mobile, city, members, booking_date, slot, branch_id, branch_name } = body

    if (!customer_name || !mobile || !city || !members || !booking_date || !slot || !branch_id) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const cleanMobile = mobile.replace(/\s/g, '')
    if (!/^[0-9]{10}$/.test(cleanMobile) && !cleanMobile.startsWith('+')) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit mobile number' },
        { status: 400 }
      )
    }

    const booking = await createBooking({
      customer_name,
      mobile: cleanMobile,
      city,
      members: parseInt(members),
      booking_date,
      slot,
      branch_id: parseInt(branch_id),
      branch_name,
    })

    sendBookingNotifications(booking)
      .then(result => {
        console.log(`📱 Booking #${booking.id} SMS results:`, result)
      })
      .catch(err => {
        console.error(`❌ Booking #${booking.id} SMS failed:`, err)
      })

    return NextResponse.json({
      success: true,
      booking,
      message: 'Booking confirmed! Check your SMS for details.'
    })
  } catch (error: any) {
    console.error('Booking error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create booking' },
      { status: 500 }
    )
  }
}