import type { MenuItem } from "./types"

// Fallback menu used only when the MySQL database can't be reached
// (e.g. inside the cloud preview). On your local machine the real data
// comes from MySQL. Kept in sync with database/schema.sql.
export const SAMPLE_MENU: MenuItem[] = [
  { id: 1, name: "Paneer Tikka", description: "Char-grilled cottage cheese marinated in spiced yogurt.", price: 320, category: "Starters", image_url: "/dishes/paneer-tikka.png", is_veg: 1, is_available: 1, created_at: "" },
  { id: 2, name: "Chicken 65", description: "Crispy fried chicken tossed with curry leaves and chillies.", price: 360, category: "Starters", image_url: "", is_veg: 0, is_available: 1, created_at: "" },
  { id: 3, name: "Veg Spring Rolls", description: "Golden rolls stuffed with fresh vegetables and herbs.", price: 240, category: "Starters", image_url: "/dishes/spring-rolls.png", is_veg: 1, is_available: 1, created_at: "" },
  { id: 4, name: "Butter Chicken", description: "Tandoori chicken simmered in a rich tomato-butter gravy.", price: 420, category: "Main Course", image_url: "/dishes/butter-chicken.png", is_veg: 0, is_available: 1, created_at: "" },
  { id: 5, name: "Paneer Butter Masala", description: "Cottage cheese in a creamy cashew-tomato gravy.", price: 360, category: "Main Course", image_url: "", is_veg: 1, is_available: 1, created_at: "" },
  { id: 6, name: "Dal Makhani", description: "Slow-cooked black lentils finished with cream and butter.", price: 290, category: "Main Course", image_url: "", is_veg: 1, is_available: 1, created_at: "" },
  { id: 7, name: "Hyderabadi Biryani", description: "Fragrant basmati rice layered with spiced meat and saffron.", price: 380, category: "Main Course", image_url: "/dishes/biryani.png", is_veg: 0, is_available: 1, created_at: "" },
  { id: 8, name: "Garlic Naan", description: "Soft tandoor bread topped with garlic and butter.", price: 70, category: "Breads", image_url: "", is_veg: 1, is_available: 1, created_at: "" },
  { id: 9, name: "Tandoori Roti", description: "Whole-wheat flatbread baked in the clay oven.", price: 35, category: "Breads", image_url: "", is_veg: 1, is_available: 1, created_at: "" },
  { id: 10, name: "Gulab Jamun", description: "Warm milk dumplings soaked in rose-cardamom syrup.", price: 160, category: "Desserts", image_url: "/dishes/gulab-jamun.png", is_veg: 1, is_available: 1, created_at: "" },
  { id: 11, name: "Gajar Ka Halwa", description: "Slow-cooked carrot pudding with nuts and ghee.", price: 180, category: "Desserts", image_url: "", is_veg: 1, is_available: 1, created_at: "" },
  { id: 12, name: "Masala Chai", description: "Spiced Indian tea brewed with milk.", price: 60, category: "Beverages", image_url: "/dishes/masala-chai.png", is_veg: 1, is_available: 1, created_at: "" },
  { id: 13, name: "Fresh Lime Soda", description: "Chilled sparkling lime, sweet or salted.", price: 90, category: "Beverages", image_url: "", is_veg: 1, is_available: 1, created_at: "" },
]
