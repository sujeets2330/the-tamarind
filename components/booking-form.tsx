"use client"

import { useState, useEffect } from "react"
import { CalendarCheck, CheckCircle2, Loader2, Users, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BOOKING_SLOTS } from "@/lib/types"

type Confirmation = {
  id: number
  customer_name: string
  mobile: string
  city: string
  members: number
  booking_date: string
  slot: string
  table_number: number
  table_capacity: number
  branch_id: number
  branch_name: string
}

type Branch = {
  id: number
  name: string
  description: string
}

const todayStr = new Date().toISOString().split("T")[0]

const branchDetails: Record<number, { address: string; timings: string; slots: string[] }> = {
  1: {
    address: "RK Colony, Nippani Road, Beside Canara Bank, Chikodi 591201",
    timings: "12:00 PM - 4:00 PM & 7:00 PM - 11:00 PM",
    slots: ["12:00 PM - 02:00 PM", "02:00 PM - 04:00 PM", "07:00 PM - 09:00 PM", "09:00 PM - 11:00 PM"]
  },
  2: {
    address: "Basaveshwar Circle, Opp. KLE Hospital, Chikodi 591201",
    timings: "7:00 AM - 9:00 PM",
    slots: ["07:00 AM - 09:00 AM", "09:00 AM - 11:00 AM", "11:00 AM - 01:00 PM", "01:00 PM - 03:00 PM", "03:00 PM - 05:00 PM", "05:00 PM - 07:00 PM", "07:00 PM - 09:00 PM"]
  }
}

// Helper function to check if a slot is in the past
function isSlotPast(slot: string, date: string): boolean {
  const today = new Date().toISOString().split("T")[0]
  
  if (date > today) return false
  
  if (date === today) {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinutes = now.getMinutes()
    const currentTime = currentHour + currentMinutes / 60
    
    const endTimeStr = slot.split(" - ")[1]
    const endHour = parseInt(endTimeStr.split(":")[0])
    const endMinutes = parseInt(endTimeStr.split(":")[1]?.split(" ")[0] || "0")
    const isPM = endTimeStr.includes("PM")
    const endHour24 = isPM && endHour !== 12 ? endHour + 12 : (endHour === 12 && !isPM ? 0 : endHour)
    const endTime = endHour24 + endMinutes / 60
    
    return endTime < currentTime
  }
  
  return false
}

export function BookingForm() {
  const [members, setMembers] = useState("2")
  const [slot, setSlot] = useState<string>("")
  const [date, setDate] = useState(todayStr)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null)
  const [branches, setBranches] = useState<Branch[]>([])
  const [selectedBranch, setSelectedBranch] = useState<string>("2")
  const [fetchingBranches, setFetchingBranches] = useState(true)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])

  useEffect(() => {
    fetchBranches()
  }, [])

  // Update available slots when branch or date changes
  useEffect(() => {
    const branchId = parseInt(selectedBranch)
    const details = branchDetails[branchId] || branchDetails[2]
    
    const filteredSlots = details.slots.filter(s => !isSlotPast(s, date))
    setAvailableSlots(filteredSlots)
    
    if (filteredSlots.length > 0 && !filteredSlots.includes(slot)) {
      setSlot(filteredSlots[0])
    } else if (filteredSlots.length === 0) {
      setSlot("")
    }
  }, [selectedBranch, date, slot])

  const fetchBranches = async () => {
    try {
      const res = await fetch('/api/branches')
      const data = await res.json()
      if (res.ok) {
        setBranches(data.branches || [])
        if (data.branches && data.branches.length > 0) {
          setSelectedBranch(String(data.branches[0].id))
        }
      }
    } catch (error) {
      console.error('Error fetching branches:', error)
    } finally {
      setFetchingBranches(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  setError(null)
  setLoading(true)

  const form = e.currentTarget
  const data = new FormData(form)

  const selectedBranchData = branches.find(b => String(b.id) === selectedBranch)

  // Check if slot is selected
  if (!slot) {
    setError("Please select a time slot.")
    setLoading(false)
    // Clear error after 5 seconds
    setTimeout(() => setError(null), 5000)
    return
  }

  if (isSlotPast(slot, date)) {
    setError("This time slot has already passed. Please select a future time.")
    setLoading(false)
    // Clear error after 5 seconds
    setTimeout(() => setError(null), 5000)
    return
  }

  const payload = {
    customer_name: String(data.get("customer_name") ?? ""),
    mobile: String(data.get("mobile") ?? ""),
    city: String(data.get("city") ?? ""),
    members: Number(members),
    booking_date: date,
    slot,
    branch_id: parseInt(selectedBranch),
    branch_name: selectedBranchData?.name || 'The Tamarind Pure Veg B2',
  }

  try {
    const res = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const json = await res.json()
    if (!res.ok) {
      setError(json.error ?? "Something went wrong.")
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000)
      return
    }
    setConfirmation(json.booking)
    form.reset()
    setMembers("2")
    setDate(todayStr)
  } catch {
    setError("Network error. Please try again.")
    // Clear error after 5 seconds
    setTimeout(() => setError(null), 5000)
  } finally {
    setLoading(false)
  }
}

  if (confirmation) {
    const branchInfo = branchDetails[confirmation.branch_id] || branchDetails[2]
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-8 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-primary" aria-hidden="true" />
        <h2 className="mt-4 font-serif text-2xl font-bold">Table booked!</h2>
        <p className="mt-2 text-muted-foreground">
          Thanks {confirmation.customer_name.split(" ")[0]}, your reservation is confirmed.
        </p>

        <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-sm text-emerald-400">
          <p className="flex items-center justify-center gap-2">
            SMS confirmation sent to your mobile number!
          </p>
        </div>

        <dl className="mx-auto mt-6 grid max-w-sm gap-3 text-left text-sm">
          <div className="flex justify-between border-b border-border/60 pb-2">
            <dt className="text-muted-foreground">Booking ID</dt>
            <dd className="font-medium">#{confirmation.id}</dd>
          </div>
          <div className="flex justify-between border-b border-border/60 pb-2">
            <dt className="text-muted-foreground">Branch</dt>
            <dd className="font-medium">{confirmation.branch_name}</dd>
          </div>
          <div className="flex justify-between border-b border-border/60 pb-2">
            <dt className="text-muted-foreground">Address</dt>
            <dd className="font-medium text-xs">{branchInfo.address}</dd>
          </div>
          <div className="flex justify-between border-b border-border/60 pb-2">
            <dt className="text-muted-foreground">Timings</dt>
            <dd className="font-medium text-xs">{branchInfo.timings}</dd>
          </div>
          <div className="flex justify-between border-b border-border/60 pb-2">
            <dt className="text-muted-foreground">Table</dt>
            <dd className="font-medium">
              No. {confirmation.table_number} (seats {confirmation.table_capacity})
            </dd>
          </div>
          <div className="flex justify-between border-b border-border/60 pb-2">
            <dt className="text-muted-foreground">Party size</dt>
            <dd className="font-medium">{confirmation.members} guest(s)</dd>
          </div>
          <div className="flex justify-between border-b border-border/60 pb-2">
            <dt className="text-muted-foreground">Date</dt>
            <dd className="font-medium">{confirmation.booking_date}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Slot</dt>
            <dd className="font-medium">{confirmation.slot}</dd>
          </div>
        </dl>

        <Button className="mt-6" onClick={() => setConfirmation(null)}>
          Book another table
        </Button>
      </div>
    )
  }

  const selectedBranchId = parseInt(selectedBranch)
  const branchInfo = branchDetails[selectedBranchId] || branchDetails[2]

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8">
      <div className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="customer_name">Full name</Label>
          <Input id="customer_name" name="customer_name" placeholder="e.g. Aarav Sharma" required />
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="mobile">Mobile number *</Label>
            <Input
              id="mobile"
              name="mobile"
              type="tel"
              inputMode="numeric"
              placeholder="10-digit number"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" placeholder="e.g. Chikodi" required />
          </div>
        </div>

        <div className="grid gap-2">
          <Label className="flex items-center gap-1.5">
            <Store className="h-4 w-4 text-muted-foreground" /> Select Branch
          </Label>
          {fetchingBranches ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading branches...
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {branches.map((branch) => (
                <button
                  key={branch.id}
                  type="button"
                  onClick={() => setSelectedBranch(String(branch.id))}
                  className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                    selectedBranch === String(branch.id)
                      ? 'border-green-600 bg-green-600 text-white shadow-md shadow-green-600/20 hover:bg-green-700'
                      : 'border-border bg-background text-muted-foreground hover:border-green-600/40 hover:text-foreground'
                  }`}
                >
                  {branch.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg bg-muted/30 p-4 space-y-1.5">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {branchInfo.address}
          </p>
          <p className="text-xs text-muted-foreground/70">
             {branchInfo.timings}
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="members" className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-muted-foreground" /> Number of members
            </Label>
            <Select value={members} onValueChange={(value) => setMembers(value)}>
              <SelectTrigger id="members">
                <SelectValue placeholder="Select guests" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} {n === 1 ? "guest" : "guests"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              min={todayStr}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label>Time slot</Label>
          <div className="grid grid-cols-2 gap-2">
            {availableSlots.length > 0 ? (
              availableSlots.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSlot(s)}
                  className={
                    "rounded-lg border px-3 py-2 text-sm font-medium transition-colors " +
                    (slot === s
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground hover:border-primary/60")
                  }
                >
                  {s}
                </button>
              ))
            ) : (
              <p className="text-sm text-muted-foreground col-span-2 text-center py-2">
                No slots available for this branch today
              </p>
            )}
          </div>
        </div>

        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Booking…
            </>
          ) : (
            <>
              <CalendarCheck className="mr-1 h-4 w-4" /> Confirm reservation
            </>
          )}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          We'll assign the best-fit table for your party size automatically.
        </p>
      </div>
    </form>
  )
}