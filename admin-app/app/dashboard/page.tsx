 "use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { 
  Leaf, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  X,
  Loader2,
  Utensils,
  LogOut,
  Eye,
  EyeOff,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  Filter,
  Upload,
  Link as LinkIcon,
  Users,
  Calendar,
  Phone,
  MapPin,
  Clock,
  Trash2 as TrashIcon,
  Tag,
  List,
  Hash,
  Store,
  Star
} from "lucide-react"

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  category: string
  image_url: string | null
  is_veg: boolean
  is_available: boolean
  branch_id: number
  rating?: number
}

interface Category {
  id: number
  name: string
  description: string
  icon: string
  display_order: number
  created_at: string
}

interface Booking {
  id: number
  customer_name: string
  mobile: string
  city: string
  members: number
  booking_date: string
  slot: string
  table_number: number | null
  status: string
  created_at: string
  branch_name: string
  branch_id: number
}

interface Branch {
  id: number
  name: string
  description: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [items, setItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedBranch, setSelectedBranch] = useState<number>(2)
  const [showModal, setShowModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "available" | "unavailable">("all")
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"menu" | "categories" | "bookings">("menu")
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image_url: "",
    is_veg: true,
    is_available: true,
    branch_id: 2,
    rating: 4.0,
  })

  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    description: "",
    icon: "",
    display_order: 0,
  })

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    await Promise.all([
      fetchItems(),
      fetchCategories(),
      fetchBookings(),
      fetchBranches()
    ])
    setLoading(false)
  }

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/menu')
      const data = await res.json()
      if (res.ok) {
        setItems(data.items || [])
      }
    } catch (error) {
      console.error('Error fetching items:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      if (res.ok) {
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings')
      const data = await res.json()
      if (res.ok) {
        setBookings(data.bookings || [])
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
  }

  const fetchBranches = async () => {
    try {
      const res = await fetch('/api/branches')
      const data = await res.json()
      if (res.ok) {
        setBranches(data.branches || [])
      }
    } catch (error) {
      console.error('Error fetching branches:', error)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  const deleteBooking = async (id: number) => {
    if (!confirm('Are you sure you want to delete this booking?')) return

    try {
      const res = await fetch(`/api/bookings?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setSuccess("Booking deleted successfully!")
        await fetchBookings()
        setTimeout(() => setSuccess(""), 2000)
      } else {
        setError("Failed to delete booking")
      }
    } catch (error) {
      console.error('Error deleting booking:', error)
      setError("Network error. Please try again.")
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB')
      return
    }

    setUploadingImage(true)
    setError('')

    try {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setFormData({ ...formData, image_url: base64String })
        setImagePreview(base64String)
        setUploadingImage(false)
        setSuccess('Image uploaded successfully!')
        setTimeout(() => setSuccess(''), 2000)
      }
      reader.onerror = () => {
        setError('Failed to read image file')
        setUploadingImage(false)
      }
      reader.readAsDataURL(file)
    } catch (err) {
      setError('Failed to upload image')
      setUploadingImage(false)
    }
  }

  const handleImageUrlChange = (url: string) => {
    setFormData({ ...formData, image_url: url })
    if (url && url.trim() !== "") {
      setImagePreview(url)
    } else {
      setImagePreview(null)
    }
  }

  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    setSuccess("")

    try {
      if (!formData.name.trim()) {
        setError("Item name is required")
        setSubmitting(false)
        return
      }
      if (!formData.description.trim()) {
        setError("Description is required")
        setSubmitting(false)
        return
      }
      if (!formData.price || parseFloat(formData.price) <= 0) {
        setError("Valid price is required")
        setSubmitting(false)
        return
      }
      if (!formData.category) {
        setError("Category is required")
        setSubmitting(false)
        return
      }

      const url = editingItem ? `/api/menu/${editingItem.id}` : '/api/menu'
      const method = editingItem ? 'PUT' : 'POST'
      
      const imageUrl = formData.image_url && formData.image_url.trim() !== "" 
        ? formData.image_url.trim() 
        : null
      
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        image_url: imageUrl,
        is_veg: formData.is_veg,
        is_available: formData.is_available,
        branch_id: formData.branch_id,
        rating: formData.rating,
      }
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(editingItem ? "Item updated successfully!" : "Item added successfully!")
        await fetchItems()
        setTimeout(() => {
          setShowModal(false)
          resetItemForm()
          setSuccess("")
        }, 1500)
      } else {
        setError(data.message || "Failed to save item")
      }
    } catch (error) {
      console.error('Error saving item:', error)
      setError("Network error. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const res = await fetch(`/api/menu/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setSuccess("Item deleted successfully!")
        await fetchItems()
        setTimeout(() => setSuccess(""), 2000)
      } else {
        setError("Failed to delete item")
      }
    } catch (error) {
      console.error('Error deleting item:', error)
      setError("Network error. Please try again.")
    }
  }

  const handleSetAvailability = async (id: number, isAvailable: boolean) => {
    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_available: isAvailable }),
      })
      if (res.ok) {
        await fetchItems()
        setSuccess(isAvailable ? "Item is now available to customers!" : "Item is now hidden from customers")
        setTimeout(() => setSuccess(""), 2000)
      }
    } catch (error) {
      console.error('Error updating availability:', error)
    }
  }

  const resetItemForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image_url: "",
      is_veg: true,
      is_available: true,
      branch_id: 2,
      rating: 4.0,
    })
    setEditingItem(null)
    setImagePreview(null)
    setError("")
    setSuccess("")
  }

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image_url: item.image_url || "",
      is_veg: item.is_veg,
      is_available: item.is_available,
      branch_id: item.branch_id || 2,
      rating: item.rating || 4.0,
    })
    setImagePreview(item.image_url || null)
    setShowModal(true)
    setError("")
    setSuccess("")
  }

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    setSuccess("")

    try {
      if (!categoryFormData.name.trim()) {
        setError("Category name is required")
        setSubmitting(false)
        return
      }

      const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories'
      const method = editingCategory ? 'PUT' : 'POST'
      
      const payload = {
        name: categoryFormData.name.trim(),
        description: categoryFormData.description.trim(),
        icon: categoryFormData.icon.trim(),
        display_order: parseInt(categoryFormData.display_order.toString()),
      }
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(editingCategory ? "Category updated successfully!" : "Category added successfully!")
        await fetchCategories()
        setTimeout(() => {
          setShowCategoryModal(false)
          resetCategoryForm()
          setSuccess("")
        }, 1500)
      } else {
        setError(data.message || "Failed to save category")
      }
    } catch (error) {
      console.error('Error saving category:', error)
      setError("Network error. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setSuccess("Category deleted successfully!")
        await fetchCategories()
        setTimeout(() => setSuccess(""), 2000)
      } else {
        const data = await res.json()
        setError(data.message || "Failed to delete category")
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      setError("Network error. Please try again.")
    }
  }

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: "",
      description: "",
      icon: "",
      display_order: 0,
    })
    setEditingCategory(null)
    setError("")
    setSuccess("")
  }

  const openEditCategoryModal = (category: Category) => {
    setEditingCategory(category)
    setCategoryFormData({
      name: category.name,
      description: category.description || "",
      icon: category.icon || "",
      display_order: category.display_order || 0,
    })
    setShowCategoryModal(true)
    setError("")
    setSuccess("")
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = search === "" || 
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
    
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    const matchesBranch = item.branch_id === selectedBranch
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "available" && item.is_available) ||
      (filterStatus === "unavailable" && !item.is_available)
    
    return matchesSearch && matchesCategory && matchesBranch && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-emerald-500 blur-2xl opacity-30 animate-pulse" />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25">
                <Leaf className="h-7 w-7" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-sm text-gray-400">Manage your restaurant</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition border border-rose-500/20"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </header>

        <div className="flex gap-2 mb-6 border-b border-gray-700/50">
          <button
            onClick={() => setActiveTab("menu")}
            className={`px-6 py-3 text-sm font-medium transition-all border-b-2 ${
              activeTab === "menu"
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Utensils className="h-4 w-4 inline mr-2" />
            Menu Items
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-6 py-3 text-sm font-medium transition-all border-b-2 ${
              activeTab === "categories"
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Tag className="h-4 w-4 inline mr-2" />
            Categories
            {categories.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-400 rounded-full">
                {categories.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-6 py-3 text-sm font-medium transition-all border-b-2 ${
              activeTab === "bookings"
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Calendar className="h-4 w-4 inline mr-2" />
            Bookings
            {bookings.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-400 rounded-full">
                {bookings.length}
              </span>
            )}
          </button>
        </div>

        {success && (
          <div className="mb-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        {activeTab === "menu" && (
          <>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2 bg-gray-800/50 rounded-xl p-1 border border-gray-700/50">
                <Store className="h-4 w-4 text-gray-400 ml-2" />
                {branches.map((branch) => (
                  <button
                    key={branch.id}
                    onClick={() => setSelectedBranch(branch.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedBranch === branch.id
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {branch.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
                <p className="text-sm text-gray-400">Total Items</p>
                <p className="text-2xl font-bold text-white">
                  {items.filter(i => i.branch_id === selectedBranch).length}
                </p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
                <p className="text-sm text-gray-400">Available</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {items.filter(i => i.branch_id === selectedBranch && i.is_available).length}
                </p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
                <p className="text-sm text-gray-400">Hidden</p>
                <p className="text-2xl font-bold text-amber-400">
                  {items.filter(i => i.branch_id === selectedBranch && !i.is_available).length}
                </p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
                <p className="text-sm text-gray-400">Categories</p>
                <p className="text-2xl font-bold text-blue-400">{categories.length}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search menu items..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-xl border border-gray-700/50 bg-gray-800/50 backdrop-blur-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>
                
                <button
                  onClick={() => {
                    resetItemForm()
                    setShowModal(true)
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/25 whitespace-nowrap"
                >
                  <Plus className="h-4 w-4" />
                  Add New Item
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Filter className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <div className="flex flex-wrap gap-1.5">
                  {["All", ...categories.map(c => c.name)].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                        selectedCategory === cat
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-gray-800/50 text-gray-400 hover:text-white border border-gray-700/50 hover:border-gray-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <span className="text-gray-600 text-xs">|</span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setFilterStatus("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      filterStatus === "all"
                        ? 'bg-gray-700 text-white border border-gray-600'
                        : 'bg-gray-800/50 text-gray-400 hover:text-white border border-gray-700/50 hover:border-gray-600'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterStatus("available")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      filterStatus === "available"
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-gray-800/50 text-gray-400 hover:text-white border border-gray-700/50 hover:border-gray-600'
                    }`}
                  >
                    <Eye className="h-3 w-3 inline mr-1" />
                    Available
                  </button>
                  <button
                    onClick={() => setFilterStatus("unavailable")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      filterStatus === "unavailable"
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-gray-800/50 text-gray-400 hover:text-white border border-gray-700/50 hover:border-gray-600'
                    }`}
                  >
                    <EyeOff className="h-3 w-3 inline mr-1" />
                    Hidden
                  </button>
                </div>
              </div>
            </div>

            {filteredItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-block p-6 rounded-full bg-gray-800/50 border border-gray-700/50 mb-4">
                  <Utensils className="h-12 w-12 text-gray-500" />
                </div>
                <p className="text-gray-400 text-lg">No items found</p>
                <p className="text-sm text-gray-500 mt-1">Click "Add New Item" to create your first menu item</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-gray-800/50 backdrop-blur-xl rounded-2xl border overflow-hidden transition-all group ${
                      item.is_available 
                        ? 'border-gray-700/50 hover:border-emerald-500/30' 
                        : 'border-amber-700/30 opacity-75 hover:border-amber-500/30'
                    }`}
                  >
                    <div className="relative h-48 bg-gray-900/50">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = ''
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                          <ImageIcon className="h-12 w-12 mb-2" />
                          <span className="text-xs">No image</span>
                        </div>
                      )}
                      
                      <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${
                        item.is_available 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {item.is_available ? (
                          <>
                            <Eye className="h-3 w-3 inline mr-1" />
                            Available
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3 inline mr-1" />
                            Hidden
                          </>
                        )}
                      </div>
                      {item.rating && (
                        <div className="absolute bottom-3 right-3">
                          <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {item.rating}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-5">
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg font-semibold text-white truncate">{item.name}</h3>
                        <span className="text-lg font-bold text-emerald-400 whitespace-nowrap ml-2">₹{item.price}</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-400 line-clamp-2">{item.description}</p>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs px-3 py-1 rounded-full bg-gray-700/50 text-gray-300 border border-gray-600/30">
                          {item.category}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-emerald-400 flex items-center gap-1">
                            <Leaf className="h-3 w-3" />
                            Pure Veg
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            Branch {item.branch_id}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        {item.is_available ? (
                          <button
                            onClick={() => handleSetAvailability(item.id, false)}
                            className="flex-1 px-3 py-2 rounded-lg text-xs font-medium transition bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30 flex items-center justify-center gap-1"
                          >
                            <EyeOff className="h-3 w-3" />
                            Hide
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSetAvailability(item.id, true)}
                            className="flex-1 px-3 py-2 rounded-lg text-xs font-medium transition bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 flex items-center justify-center gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            Show
                          </button>
                        )}
                        <button
                          onClick={() => openEditModal(item)}
                          className="px-3 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition border border-blue-500/30"
                          title="Edit item"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="px-3 py-2 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 rounded-lg transition border border-rose-500/30"
                          title="Delete item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "categories" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Manage Categories</h2>
                <p className="text-sm text-gray-400">Add, edit, or delete menu categories</p>
              </div>
              <button
                onClick={() => {
                  resetCategoryForm()
                  setShowCategoryModal(true)
                }}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/25 whitespace-nowrap"
              >
                <Plus className="h-4 w-4" />
                Add Category
              </button>
            </div>

            {categories.length === 0 ? (
              <div className="text-center py-16 bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50">
                <div className="inline-block p-6 rounded-full bg-gray-700/30 border border-gray-600/30 mb-4">
                  <Tag className="h-12 w-12 text-gray-500" />
                </div>
                <p className="text-gray-400 text-lg">No categories yet</p>
                <p className="text-sm text-gray-500 mt-1">Click "Add Category" to create your first category</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-5 hover:border-emerald-500/30 transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {category.icon ? (
                            <span className="text-2xl">{category.icon}</span>
                          ) : (
                            <Tag className="h-5 w-5 text-emerald-400" />
                          )}
                          <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                        </div>
                        {category.description && (
                          <p className="mt-1 text-sm text-gray-400">{category.description}</p>
                        )}
                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                          <span>Order: {category.display_order}</span>
                          <span>•</span>
                          <span>ID: #{category.id}</span>
                          <span>•</span>
                          <span className="text-emerald-400">
                            {items.filter(i => i.category === category.name).length} items
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => openEditCategoryModal(category)}
                          className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition border border-blue-500/30"
                          title="Edit category"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="p-2 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 rounded-lg transition border border-rose-500/30"
                          title="Delete category"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "bookings" && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
                <p className="text-sm text-gray-400">Total Bookings</p>
                <p className="text-2xl font-bold text-white">{bookings.length}</p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
                <p className="text-sm text-gray-400">Today's Bookings</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {bookings.filter(b => b.booking_date === new Date().toISOString().split('T')[0]).length}
                </p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
                <p className="text-sm text-gray-400">Total Guests</p>
                <p className="text-2xl font-bold text-blue-400">
                  {bookings.reduce((sum, b) => sum + b.members, 0)}
                </p>
              </div>
            </div>

            {bookings.length === 0 ? (
              <div className="text-center py-16 bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50">
                <div className="inline-block p-6 rounded-full bg-gray-700/30 border border-gray-600/30 mb-4">
                  <Calendar className="h-12 w-12 text-gray-500" />
                </div>
                <p className="text-gray-400 text-lg">No bookings yet</p>
                <p className="text-sm text-gray-500 mt-1">When customers book, they'll appear here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-5 hover:border-emerald-500/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{booking.customer_name}</h3>
                        <p className="text-sm text-gray-400 flex items-center gap-1">
                          <Store className="h-3 w-3" />
                          {booking.branch_name || 'Tamarind Branch 2'}
                        </p>
                        <p className="text-sm text-gray-400 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {booking.mobile}
                        </p>
                        <p className="text-sm text-gray-400 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {booking.city}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteBooking(booking.id)}
                        className="p-2 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 rounded-lg transition border border-rose-500/30"
                        title="Delete booking"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-gray-700/30 rounded-lg p-2">
                        <p className="text-gray-500 text-xs">Guests</p>
                        <p className="text-white font-medium">{booking.members}</p>
                      </div>
                      <div className="bg-gray-700/30 rounded-lg p-2">
                        <p className="text-gray-500 text-xs">Table</p>
                        <p className="text-white font-medium">#{booking.table_number || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-700/30 rounded-lg p-2">
                        <p className="text-gray-500 text-xs">Date</p>
                        <p className="text-white font-medium">{booking.booking_date}</p>
                      </div>
                      <div className="bg-gray-700/30 rounded-lg p-2">
                        <p className="text-gray-500 text-xs">Slot</p>
                        <p className="text-white font-medium">{booking.slot}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        booking.status === 'confirmed' 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {booking.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(booking.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ITEM MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false)
                  resetItemForm()
                }}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <form onSubmit={handleItemSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-gray-700/50 bg-gray-900/50 px-4 py-2.5 text-white placeholder:text-gray-500 outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  placeholder="e.g., Masala Dosa"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-gray-700/50 bg-gray-900/50 px-4 py-2.5 text-white placeholder:text-gray-500 outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  placeholder="Describe your dish..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full rounded-xl border border-gray-700/50 bg-gray-900/50 px-4 py-2.5 text-white placeholder:text-gray-500 outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    placeholder="199"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-gray-700/50 bg-gray-900/50 px-4 py-2.5 text-white outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* RATING FIELD */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Rating (1.0 - 5.0)
                </label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                  className="w-full rounded-xl border border-gray-700/50 bg-gray-900/50 px-4 py-2.5 text-white outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                >
                  <option value="5.0">5.0 ★★★★★</option>
                  <option value="4.9">4.9 ★★★★★</option>
                  <option value="4.8">4.8 ★★★★★</option>
                  <option value="4.7">4.7 ★★★★</option>
                  <option value="4.6">4.6 ★★★★</option>
                  <option value="4.5">4.5 ★★★★</option>
                  <option value="4.4">4.4 ★★★★</option>
                  <option value="4.3">4.3 ★★★★</option>
                  <option value="4.2">4.2 ★★★★</option>
                  <option value="4.1">4.1 ★★★★</option>
                  <option value="4.0">4.0 ★★★★</option>
                  <option value="3.9">3.9 ★★★</option>
                  <option value="3.8">3.8 ★★★</option>
                  <option value="3.5">3.5 ★★★</option>
                  <option value="3.0">3.0 ★★★</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">Set rating based on customer feedback</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Branch *
                </label>
                <select
                  value={formData.branch_id}
                  onChange={(e) => setFormData({ ...formData, branch_id: parseInt(e.target.value) })}
                  className="w-full rounded-xl border border-gray-700/50 bg-gray-900/50 px-4 py-2.5 text-white outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  required
                >
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Image
                </label>
                
                {imagePreview && (
                  <div className="relative mb-3 rounded-xl overflow-hidden bg-gray-900/50 border border-gray-700/50">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-40 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null)
                        setFormData({ ...formData, image_url: "" })
                      }}
                      className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <input
                        type="text"
                        value={formData.image_url}
                        onChange={(e) => handleImageUrlChange(e.target.value)}
                        placeholder="https://example.com/dish-image.jpg"
                        className="w-full rounded-xl border border-gray-700/50 bg-gray-900/50 pl-10 pr-4 py-2.5 text-white placeholder:text-gray-500 outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-700/50" />
                    <span className="text-xs text-gray-500">OR</span>
                    <div className="flex-1 h-px bg-gray-700/50" />
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="w-full py-2.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl border border-blue-500/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {uploadingImage ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Upload from Device
                      </>
                    )}
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Upload JPG, PNG or GIF (max 5MB)</p>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_veg}
                    onChange={(e) => setFormData({ ...formData, is_veg: e.target.checked })}
                    className="rounded border-gray-600 bg-gray-700 text-emerald-500 focus:ring-emerald-500 w-4 h-4"
                  />
                  Pure Vegetarian
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_available}
                    onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                    className="rounded border-gray-600 bg-gray-700 text-emerald-500 focus:ring-emerald-500 w-4 h-4"
                  />
                  Available
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {editingItem ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  editingItem ? 'Update Item' : 'Add Item'
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button
                onClick={() => {
                  setShowCategoryModal(false)
                  resetCategoryForm()
                }}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                  className="w-full rounded-xl border border-gray-700/50 bg-gray-900/50 px-4 py-2.5 text-white placeholder:text-gray-500 outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  placeholder="e.g., North Indian"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={categoryFormData.description}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                  rows={2}
                  className="w-full rounded-xl border border-gray-700/50 bg-gray-900/50 px-4 py-2.5 text-white placeholder:text-gray-500 outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  placeholder="Brief description of this category"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Icon (Emoji)
                  </label>
                  <input
                    type="text"
                    value={categoryFormData.icon}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, icon: e.target.value })}
                    className="w-full rounded-xl border border-gray-700/50 bg-gray-900/50 px-4 py-2.5 text-white placeholder:text-gray-500 outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    placeholder=""
                    maxLength={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={categoryFormData.display_order}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-gray-700/50 bg-gray-900/50 px-4 py-2.5 text-white placeholder:text-gray-500 outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {editingCategory ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  editingCategory ? 'Update Category' : 'Add Category'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}