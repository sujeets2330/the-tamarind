// import twilio from 'twilio'

// const accountSid = process.env.TWILIO_ACCOUNT_SID
// const authToken = process.env.TWILIO_AUTH_TOKEN
// const twilioPhone = process.env.TWILIO_PHONE_NUMBER
// const adminPhone = process.env.ADMIN_PHONE_NUMBER
// const sendWhatsApp = process.env.TWILIO_SEND_WHATSAPP === 'true'

// let client: twilio.Twilio | null = null

// if (accountSid && authToken && twilioPhone) {
//   client = twilio(accountSid, authToken)
//   console.log(' Twilio client initialized')
//   console.log(`   Mode: ${sendWhatsApp ? 'WhatsApp' : 'SMS'}`)
//   console.log(`   From number: ${twilioPhone}`)
// }

// interface BookingDetails {
//   id: number
//   customer_name: string
//   mobile: string
//   city: string
//   members: number
//   booking_date: string
//   slot: string
//   table_number: number
//   branch_id?: number
//   branch_name?: string
// }

// function formatPhoneNumber(phone: string): string {
//   const cleanPhone = phone.replace(/\s/g, '')
//   if (cleanPhone.startsWith('+')) {
//     return cleanPhone
//   }
//   if (cleanPhone.startsWith('0')) {
//     return `+91${cleanPhone.substring(1)}`
//   }
//   return `+91${cleanPhone}`
// }

// function getFromNumber(): string {
//   if (sendWhatsApp) {
//     return twilioPhone?.startsWith('whatsapp:') ? twilioPhone : `whatsapp:${twilioPhone}`
//   }
//   return twilioPhone || ''
// }

// function getToNumber(phone: string): string {
//   const formattedPhone = formatPhoneNumber(phone)
//   if (sendWhatsApp) {
//     return `whatsapp:${formattedPhone}`
//   }
//   return formattedPhone
// }

// function getBranchAddress(branchId: number): string {
//   if (branchId === 1) {
//     return 'RK Colony, Nippani Road, Beside Canara Bank, Chikodi 591201'
//   }
//   return 'Basaveshwar Circle, Opp. KLE Hospital, Chikodi 591201'
// }

// function getBranchTimings(branchId: number): string {
//   if (branchId === 1) {
//     return '12:00 PM - 4:00 PM & 7:00 PM - 11:00 PM'
//   }
//   return '7:00 PM - 9:00 PM'
// }

// function getBranchName(branchId: number): string {
//   if (branchId === 1) {
//     return 'Tamarind Branch 1'
//   }
//   return 'Tamarind Branch 2'
// }

// export async function sendAdminBookingSMS(booking: BookingDetails): Promise<{ success: boolean; sid?: string; error?: string }> {
//   if (!client || !twilioPhone || !adminPhone) {
//     console.log(' SMS not configured. Skipping admin SMS.')
//     return { success: false, error: 'SMS not configured' }
//   }

//   try {
//     const fromNumber = getFromNumber()
//     const toNumber = getToNumber(adminPhone)
//     const branchId = booking.branch_id || 2
//     const address = getBranchAddress(branchId)
//     const timings = getBranchTimings(branchId)
//     const branchName = getBranchName(branchId)
    
//     console.log(` Sending admin ${sendWhatsApp ? 'WhatsApp' : 'SMS'}:`)
//     console.log(`   From: ${fromNumber}`)
//     console.log(`   To: ${toNumber}`)

//     const message = sendWhatsApp ? `
//  *New Booking at The Tamarind Pure Veg!*

//  *Branch:* ${branchName}
//  *Customer:* ${booking.customer_name}
//  *Mobile:* ${booking.mobile}
//  *Guests:* ${booking.members}
//  *Table:* #${booking.table_number}
//  *Date:* ${booking.booking_date}
//  *Time:* ${booking.slot}
//  *Booking ID:* #${booking.id}

//  *Address:*
// ${address}

//  *Timings:* ${timings}
//     `.trim() : `
//  New Booking at The Tamarind Pure Veg!

// Branch: ${branchName}
// Customer: ${booking.customer_name}
// Mobile: ${booking.mobile}
// Guests: ${booking.members}
// Table: #${booking.table_number}
// Date: ${booking.booking_date}
// Time: ${booking.slot}
// Booking ID: #${booking.id}

// Address: ${address}
// Timings: ${timings}
//     `.trim()

//     const result = await client.messages.create({
//       body: message,
//       from: fromNumber,
//       to: toNumber,
//     })

//     console.log(` Admin ${sendWhatsApp ? 'WhatsApp' : 'SMS'} sent, SID: ${result.sid}`)
//     return { success: true, sid: result.sid }
//   } catch (error: any) {
//     console.error(` Admin ${sendWhatsApp ? 'WhatsApp' : 'SMS'} failed:`, error.message)
//     return { success: false, error: error.message }
//   }
// }

// export async function sendCustomerBookingSMS(booking: BookingDetails): Promise<{ success: boolean; sid?: string; error?: string }> {
//   if (!client || !twilioPhone) {
//     console.log(' SMS not configured. Skipping customer SMS.')
//     return { success: false, error: 'SMS not configured' }
//   }

//   try {
//     const fromNumber = getFromNumber()
//     const toNumber = getToNumber(booking.mobile)
//     const branchId = booking.branch_id || 2
//     const address = getBranchAddress(branchId)
//     const timings = getBranchTimings(branchId)
//     const branchName = getBranchName(branchId)
    
//     console.log(` Sending customer ${sendWhatsApp ? 'WhatsApp' : 'SMS'}:`)
//     console.log(`   From: ${fromNumber}`)
//     console.log(`   To: ${toNumber}`)

//     const message = sendWhatsApp ? `
//  *Booking Confirmed!*

// Hi *${booking.customer_name}*!

//  *Branch:* ${branchName}
//  *Date:* ${booking.booking_date}
//  *Time:* ${booking.slot}
//  *Guests:* ${booking.members}
//  *Table:* #${booking.table_number}
//  *Booking ID:* #${booking.id}

//  *Address:*
// ${address}

//  *Timings:* ${timings}

//  *For changes:* +91 98765 43210

// Thank you for choosing The Tamarind Pure Veg!
//     `.trim() : `
//  Booking Confirmed!

// Hi ${booking.customer_name}!

// Branch: ${branchName}
// Date: ${booking.booking_date}
// Time: ${booking.slot}
// Guests: ${booking.members}
// Table: #${booking.table_number}
// Booking ID: #${booking.id}

// Address: ${address}
// Timings: ${timings}

// For changes: +91 98765 43210

// Thank you for choosing The Tamarind Pure Veg!
//     `.trim()

//     const result = await client.messages.create({
//       body: message,
//       from: fromNumber,
//       to: toNumber,
//     })

//     console.log(`Customer ${sendWhatsApp ? 'WhatsApp' : 'SMS'} sent, SID: ${result.sid}`)
//     return { success: true, sid: result.sid }
//   } catch (error: any) {
//     console.error(` Customer ${sendWhatsApp ? 'WhatsApp' : 'SMS'} failed:`, error.message)
//     return { success: false, error: error.message }
//   }
// }

// export async function sendBookingNotifications(booking: BookingDetails): Promise<{
//   admin: { success: boolean; sid?: string; error?: string }
//   customer: { success: boolean; sid?: string; error?: string }
// }> {
//   console.log(` Sending ${sendWhatsApp ? 'WhatsApp' : 'SMS'} notifications for booking #${booking.id}...`)

//   const [adminResult, customerResult] = await Promise.all([
//     sendAdminBookingSMS(booking),
//     sendCustomerBookingSMS(booking),
//   ])

//   console.log(` Summary: Admin: ${adminResult.success ? 'YES' : 'NO'}, Customer: ${customerResult.success ? 'YES' : 'NO'}`)

//   return {
//     admin: adminResult,
//     customer: customerResult,
//   }
// }








// import twilio from 'twilio'

// const accountSid = process.env.TWILIO_ACCOUNT_SID
// const authToken = process.env.TWILIO_AUTH_TOKEN
// const twilioPhone = process.env.TWILIO_PHONE_NUMBER
// const adminPhone = process.env.ADMIN_PHONE_NUMBER

// let client: twilio.Twilio | null = null

// if (accountSid && authToken && twilioPhone) {
//   client = twilio(accountSid, authToken)
//   console.log(' Twilio client initialized - SMS Mode')
// }

// interface BookingDetails {
//   id: number
//   customer_name: string
//   mobile: string
//   city: string
//   members: number
//   booking_date: string
//   slot: string
//   table_number: number
// }

// function formatPhoneNumber(phone: string): string {
//   const cleanPhone = phone.replace(/\s/g, '')
//   if (cleanPhone.startsWith('+')) {
//     return cleanPhone
//   }
//   if (cleanPhone.startsWith('0')) {
//     return `+91${cleanPhone.substring(1)}`
//   }
//   return `+91${cleanPhone}`
// }

// export async function sendAdminBookingSMS(booking: BookingDetails): Promise<{ success: boolean; sid?: string; error?: string }> {
//   if (!client || !twilioPhone || !adminPhone) {
//     console.log(' SMS not configured. Skipping admin SMS.')
//     return { success: false, error: 'SMS not configured' }
//   }

//   try {
//     const toNumber = adminPhone
    
//     console.log(` Sending admin SMS to: ${toNumber}`)

//     const message = `New booking #${booking.id}: ${booking.customer_name}, ${booking.members} guests, ${booking.booking_date} ${booking.slot}. Table #${booking.table_number}.`

//     const result = await client.messages.create({
//       body: message,
//       from: twilioPhone,
//       to: toNumber,
//     })

//     console.log(` Admin SMS sent, SID: ${result.sid}`)
//     return { success: true, sid: result.sid }
//   } catch (error: any) {
//     console.error(` Admin SMS failed:`, error.message)
//     return { success: false, error: error.message }
//   }
// }

// export async function sendCustomerBookingSMS(booking: BookingDetails): Promise<{ success: boolean; sid?: string; error?: string }> {
//   if (!client || !twilioPhone) {
//     console.log(' SMS not configured. Skipping customer SMS.')
//     return { success: false, error: 'SMS not configured' }
//   }

//   try {
//     const toNumber = formatPhoneNumber(booking.mobile)
    
//     console.log(` Sending customer SMS to: ${toNumber}`)

//     const message = `Booking confirmed #${booking.id}! ${booking.customer_name}, ${booking.booking_date} ${booking.slot}, ${booking.members} guests, Table #${booking.table_number}.`

//     const result = await client.messages.create({
//       body: message,
//       from: twilioPhone,
//       to: toNumber,
//     })

//     console.log(` Customer SMS sent, SID: ${result.sid}`)
//     return { success: true, sid: result.sid }
//   } catch (error: any) {
//     console.error(` Customer SMS failed:`, error.message)
//     return { success: false, error: error.message }
//   }
// }

// export async function sendBookingNotifications(booking: BookingDetails): Promise<{
//   admin: { success: boolean; sid?: string; error?: string }
//   customer: { success: boolean; sid?: string; error?: string }
// }> {
//   console.log(` Sending SMS notifications for booking #${booking.id}...`)

//   const [adminResult, customerResult] = await Promise.all([
//     sendAdminBookingSMS(booking),
//     sendCustomerBookingSMS(booking),
//   ])

//   console.log(` Summary: Admin: ${adminResult.success ? 'YES' : 'NO'}, Customer: ${customerResult.success ? 'YES' : 'NO'}`)

//   return {
//     admin: adminResult,
//     customer: customerResult,
//   }
// }






import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioPhone = process.env.TWILIO_PHONE_NUMBER
const adminPhone = process.env.ADMIN_PHONE_NUMBER

let client: twilio.Twilio | null = null

if (accountSid && authToken && twilioPhone) {
  client = twilio(accountSid, authToken)
  console.log(' Twilio client initialized')
  console.log(`   Mode: SMS`)
  console.log(`   From number: ${twilioPhone}`)
}

interface BookingDetails {
  id: number
  customer_name: string
  mobile: string
  city: string
  members: number
  booking_date: string
  slot: string
  table_number: number
  branch_id?: number
  branch_name?: string
}

function formatPhoneNumber(phone: string): string {
  const cleanPhone = phone.replace(/\s/g, '')
  if (cleanPhone.startsWith('+')) {
    return cleanPhone
  }
  if (cleanPhone.startsWith('0')) {
    return `+91${cleanPhone.substring(1)}`
  }
  return `+91${cleanPhone}`
}

function getBranchAddress(branchId: number): string {
  if (branchId === 1) {
    return 'RK Colony, Nippani Road, Beside Canara Bank, Chikodi 591201'
  }
  return 'Basaveshwar Circle, Opp. KLE Hospital, Chikodi 591201'
}

function getBranchTimings(branchId: number): string {
  if (branchId === 1) {
    return '12:00 PM - 4:00 PM & 7:00 PM - 11:00 PM'
  }
  return '7:00 PM - 9:00 PM'
}

function getBranchName(branchId: number): string {
  if (branchId === 1) {
    return 'Tamarind Branch 1'
  }
  return 'Tamarind Branch 2'
}

export async function sendAdminBookingSMS(booking: BookingDetails): Promise<{ success: boolean; sid?: string; error?: string }> {
  if (!client || !twilioPhone || !adminPhone) {
    console.log(' SMS not configured. Skipping admin SMS.')
    return { success: false, error: 'SMS not configured' }
  }

  try {
    const toNumber = formatPhoneNumber(adminPhone)
    const branchId = booking.branch_id || 2
    const address = getBranchAddress(branchId)
    const timings = getBranchTimings(branchId)
    const branchName = getBranchName(branchId)
    
    console.log(`Sending admin SMS:`)
    console.log(`   From: ${twilioPhone}`)
    console.log(`   To: ${toNumber}`)

    const message = `
🔔 New Booking Alert!

Branch: ${branchName}
Customer: ${booking.customer_name}
Mobile: ${booking.mobile}
Guests: ${booking.members}
Table: #${booking.table_number}
Date: ${booking.booking_date}
Time: ${booking.slot}
Booking ID: #${booking.id}

Address: ${address}
Timings: ${timings}
    `.trim()

    const result = await client.messages.create({
      body: message,
      from: twilioPhone,
      to: toNumber,
    })

    console.log(` Admin SMS sent, SID: ${result.sid}`)
    return { success: true, sid: result.sid }
  } catch (error: any) {
    console.error(` Admin SMS failed:`, error.message)
    return { success: false, error: error.message }
  }
}

export async function sendCustomerBookingSMS(booking: BookingDetails): Promise<{ success: boolean; sid?: string; error?: string }> {
  if (!client || !twilioPhone) {
    console.log(' SMS not configured. Skipping customer SMS.')
    return { success: false, error: 'SMS not configured' }
  }

  try {
    const toNumber = formatPhoneNumber(booking.mobile)
    const branchId = booking.branch_id || 2
    const address = getBranchAddress(branchId)
    const timings = getBranchTimings(branchId)
    const branchName = getBranchName(branchId)
    
    console.log(`Sending customer SMS:`)
    console.log(`   From: ${twilioPhone}`)
    console.log(`   To: ${toNumber}`)

    const message = `
✅ Booking Confirmed!

Hi ${booking.customer_name}!

Branch: ${branchName}
Date: ${booking.booking_date}
Time: ${booking.slot}
Guests: ${booking.members}
Table: #${booking.table_number}
Booking ID: #${booking.id}

Address: ${address}
Timings: ${timings}

For changes: +91 98765 43210

Thank you for choosing The Tamarind Pure Veg!
    `.trim()

    const result = await client.messages.create({
      body: message,
      from: twilioPhone,
      to: toNumber,
    })

    console.log(` Customer SMS sent, SID: ${result.sid}`)
    return { success: true, sid: result.sid }
  } catch (error: any) {
    console.error(` Customer SMS failed:`, error.message)
    return { success: false, error: error.message }
  }
}

export async function sendBookingNotifications(booking: BookingDetails): Promise<{
  admin: { success: boolean; sid?: string; error?: string }
  customer: { success: boolean; sid?: string; error?: string }
}> {
  console.log(`Sending SMS notifications for booking #${booking.id}...`)

  const [adminResult, customerResult] = await Promise.all([
    sendAdminBookingSMS(booking),
    sendCustomerBookingSMS(booking),
  ])

  console.log(` Summary: Admin: ${adminResult.success ? 'YES' : 'NO'}, Customer: ${customerResult.success ? 'YES' : 'NO'}`)

  return {
    admin: adminResult,
    customer: customerResult,
  }
}