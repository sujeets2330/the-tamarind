export interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  category: string
  image_url: string | null
  is_veg: boolean
  is_available: boolean
  rating?: number  // Make it optional, not nullable
  created_at?: string
  updated_at?: string
}

export type Booking = {
  id: number
  customer_name: string
  mobile: string
  city: string
  members: number
  booking_date: string
  slot: string
  table_id: number | null
  status: string
  created_at: string
}

// Fixed set of booking slots offered to customers.
export const BOOKING_SLOTS = [
  "12:00 PM - 02:00 PM",
  "02:00 PM - 04:00 PM",
  "07:00 PM - 09:00 PM",
  "09:00 PM - 11:00 PM",
] as const

export const MENU_CATEGORIES = [
  "Starters",
  "Main Course",
  "Breads",
  "Desserts",
  "Beverages",
] as const
