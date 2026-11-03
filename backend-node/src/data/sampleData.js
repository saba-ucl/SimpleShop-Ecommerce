// Sample data, identical to backend/.../config/DataInitializer.java
// All prices are in Danish kroner (DKK).

export const categories = [
  { key: "electronics", name: "Electronics", description: "Gadgets and electronic devices" },
  { key: "clothing", name: "Clothing", description: "Everyday clothes and footwear" },
  { key: "books", name: "Books", description: "Programming and learning books" },
  { key: "accessories", name: "Accessories", description: "Bags and useful everyday accessories" },
];

// Products without a photo get a placeholder image that shows the product name.
// The name is encoded the same way as Java's URLEncoder (spaces become "+"),
// so the image URLs are identical to the Java backend.
const javaUrlEncode = (text) => encodeURIComponent(text)
  .replace(/[!'()~]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase())
  .replace(/%20/g, '+');
const placeholder = (name) => `https://placehold.co/900x650?text=${javaUrlEncode(name)}`;

export const products = [
  { name: "Laptop", description: "15.6-inch laptop suitable for study, coding and office work.", price: 5999, stock: 12, imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80", category: "electronics" },
  { name: "Smartphone", description: "Modern smartphone with a bright display and reliable battery.", price: 2999, stock: 20, imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80", category: "electronics" },
  { name: "Wireless Headphones", description: "Comfortable wireless headphones for music, classes and calls.", price: 699, stock: 35, imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80", category: "electronics" },
  { name: "T-Shirt", description: "Comfortable cotton T-shirt for everyday wear.", price: 129, stock: 50, imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80", category: "clothing" },
  { name: "Jeans", description: "Classic blue denim jeans with a comfortable fit.", price: 399, stock: 30, imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80", category: "clothing" },
  { name: "Running Shoes", description: "Lightweight sports shoes for walking and running.", price: 599, stock: 22, imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80", category: "clothing" },
  { name: "Java Programming Book", description: "Beginner-friendly Java book covering core programming concepts.", price: 299, stock: 25, imageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=900&q=80", category: "books" },
  { name: "Spring Boot Guide", description: "A practical introduction to building REST APIs with Spring Boot.", price: 349, stock: 18, imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80", category: "books" },
  { name: "Laptop Backpack", description: "Water-resistant backpack with a dedicated laptop compartment.", price: 349, stock: 28, imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80", category: "accessories" },
  { name: "Travel Wallet", description: "Compact wallet for cards, cash and travel documents.", price: 149, stock: 40, imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80", category: "accessories" },
  { name: "Bluetooth Speaker", description: "Portable speaker with deep bass and 10 hours of battery life.", price: 399, stock: 40, imageUrl: placeholder("Bluetooth Speaker"), category: "electronics" },
  { name: "Smartwatch", description: "Fitness tracking, notifications and heart-rate monitoring on your wrist.", price: 1299, stock: 25, imageUrl: placeholder("Smartwatch"), category: "electronics" },
  { name: "Tablet", description: "10-inch tablet for reading, streaming and note-taking.", price: 2499, stock: 15, imageUrl: placeholder("Tablet"), category: "electronics" },
  { name: "USB-C Charger", description: "Fast 65W USB-C charger for laptops and phones.", price: 249, stock: 60, imageUrl: placeholder("USB-C Charger"), category: "electronics" },
  { name: "Power Bank", description: "10000 mAh power bank with two USB ports.", price: 199, stock: 45, imageUrl: placeholder("Power Bank"), category: "electronics" },
  { name: "Wireless Mouse", description: "Quiet wireless mouse with long battery life.", price: 149, stock: 50, imageUrl: placeholder("Wireless Mouse"), category: "electronics" },
  { name: "Mechanical Keyboard", description: "Tactile mechanical keyboard with backlit keys.", price: 599, stock: 20, imageUrl: placeholder("Mechanical Keyboard"), category: "electronics" },
  { name: "27-inch Monitor", description: "Full HD IPS monitor with thin bezels.", price: 1499, stock: 10, imageUrl: placeholder("27-inch Monitor"), category: "electronics" },
  { name: "HD Webcam", description: "1080p webcam with built-in microphone for online classes.", price: 399, stock: 18, imageUrl: placeholder("HD Webcam"), category: "electronics" },
  { name: "External SSD 1TB", description: "Fast and compact 1TB portable SSD.", price: 799, stock: 14, imageUrl: placeholder("External SSD 1TB"), category: "electronics" },
  { name: "Wireless Earbuds", description: "True wireless earbuds with charging case.", price: 499, stock: 35, imageUrl: placeholder("Wireless Earbuds"), category: "electronics" },
  { name: "Gaming Controller", description: "Wireless controller compatible with PC and mobile.", price: 449, stock: 16, imageUrl: placeholder("Gaming Controller"), category: "electronics" },
  { name: "Smart LED Bulb", description: "Color-changing LED bulb controlled from your phone.", price: 99, stock: 70, imageUrl: placeholder("Smart LED Bulb"), category: "electronics" },
  { name: "Hoodie", description: "Warm fleece hoodie with front pocket.", price: 299, stock: 30, imageUrl: placeholder("Hoodie"), category: "clothing" },
  { name: "Denim Jacket", description: "Classic denim jacket for all seasons.", price: 499, stock: 15, imageUrl: placeholder("Denim Jacket"), category: "clothing" },
  { name: "Formal Shirt", description: "Slim-fit cotton shirt for office and events.", price: 279, stock: 35, imageUrl: placeholder("Formal Shirt"), category: "clothing" },
  { name: "Chinos", description: "Comfortable stretch chinos for everyday wear.", price: 349, stock: 28, imageUrl: placeholder("Chinos"), category: "clothing" },
  { name: "Polo Shirt", description: "Breathable cotton polo shirt.", price: 199, stock: 40, imageUrl: placeholder("Polo Shirt"), category: "clothing" },
  { name: "Sneakers", description: "Casual white sneakers that go with everything.", price: 699, stock: 20, imageUrl: placeholder("Sneakers"), category: "clothing" },
  { name: "Rain Jacket", description: "Lightweight waterproof jacket with hood.", price: 449, stock: 18, imageUrl: placeholder("Rain Jacket"), category: "clothing" },
  { name: "Woollen Sweater", description: "Soft knitted sweater for cold days.", price: 399, stock: 22, imageUrl: placeholder("Woollen Sweater"), category: "clothing" },
  { name: "Track Pants", description: "Relaxed track pants for sports and home.", price: 229, stock: 34, imageUrl: placeholder("Track Pants"), category: "clothing" },
  { name: "Cotton Socks (Pack of 5)", description: "Everyday cotton socks in mixed colors.", price: 79, stock: 80, imageUrl: placeholder("Cotton Socks (Pack of 5)"), category: "clothing" },
  { name: "Winter Cap", description: "Knitted beanie to keep you warm.", price: 99, stock: 55, imageUrl: placeholder("Winter Cap"), category: "clothing" },
  { name: "Sandals", description: "Comfortable sandals for summer and travel.", price: 249, stock: 30, imageUrl: placeholder("Sandals"), category: "clothing" },
  { name: "Python Programming Book", description: "Learn Python step by step with simple examples.", price: 279, stock: 26, imageUrl: placeholder("Python Programming Book"), category: "books" },
  { name: "Data Structures and Algorithms", description: "Arrays, lists, trees and sorting explained clearly.", price: 349, stock: 20, imageUrl: placeholder("Data Structures and Algorithms"), category: "books" },
  { name: "Web Development with HTML and CSS", description: "Build your first websites from scratch.", price: 249, stock: 24, imageUrl: placeholder("Web Development with HTML and CSS"), category: "books" },
  { name: "JavaScript for Beginners", description: "Core JavaScript concepts with hands-on exercises.", price: 269, stock: 22, imageUrl: placeholder("JavaScript for Beginners"), category: "books" },
  { name: "React Handbook", description: "Components, state and hooks for modern web apps.", price: 299, stock: 18, imageUrl: placeholder("React Handbook"), category: "books" },
  { name: "SQL Basics", description: "Write queries, joins and simple database designs.", price: 229, stock: 25, imageUrl: placeholder("SQL Basics"), category: "books" },
  { name: "Clean Code Practices", description: "How to write readable and maintainable code.", price: 399, stock: 15, imageUrl: placeholder("Clean Code Practices"), category: "books" },
  { name: "Computer Networks Explained", description: "TCP/IP, HTTP and the internet made simple.", price: 299, stock: 17, imageUrl: placeholder("Computer Networks Explained"), category: "books" },
  { name: "Introduction to Machine Learning", description: "Beginner-friendly overview of ML concepts and models.", price: 429, stock: 14, imageUrl: placeholder("Introduction to Machine Learning"), category: "books" },
  { name: "Git and GitHub Guide", description: "Version control for individuals and teams.", price: 179, stock: 30, imageUrl: placeholder("Git and GitHub Guide"), category: "books" },
  { name: "Operating Systems Basics", description: "Processes, memory and file systems explained.", price: 299, stock: 16, imageUrl: placeholder("Operating Systems Basics"), category: "books" },
  { name: "Software Testing Fundamentals", description: "Unit tests, integration tests and test planning.", price: 279, stock: 19, imageUrl: placeholder("Software Testing Fundamentals"), category: "books" },
  { name: "Leather Belt", description: "Genuine leather belt with metal buckle.", price: 199, stock: 38, imageUrl: placeholder("Leather Belt"), category: "accessories" },
  { name: "Sunglasses", description: "UV-protected sunglasses with a classic frame.", price: 249, stock: 27, imageUrl: placeholder("Sunglasses"), category: "accessories" },
  { name: "Water Bottle", description: "Insulated steel bottle that keeps drinks cold for 24 hours.", price: 149, stock: 60, imageUrl: placeholder("Water Bottle"), category: "accessories" },
  { name: "Laptop Sleeve", description: "Padded sleeve for 13 to 15-inch laptops.", price: 179, stock: 32, imageUrl: placeholder("Laptop Sleeve"), category: "accessories" },
  { name: "Phone Case", description: "Shock-absorbing case with a slim profile.", price: 99, stock: 65, imageUrl: placeholder("Phone Case"), category: "accessories" },
  { name: "Travel Pillow", description: "Memory-foam neck pillow for long journeys.", price: 149, stock: 24, imageUrl: placeholder("Travel Pillow"), category: "accessories" },
  { name: "Umbrella", description: "Compact foldable umbrella with automatic open.", price: 129, stock: 36, imageUrl: placeholder("Umbrella"), category: "accessories" },
  { name: "Wristwatch", description: "Analog wristwatch with stainless steel strap.", price: 899, stock: 12, imageUrl: placeholder("Wristwatch"), category: "accessories" },
  { name: "Desk Organizer", description: "Keep pens, notes and gadgets tidy on your desk.", price: 149, stock: 29, imageUrl: placeholder("Desk Organizer"), category: "accessories" },
  { name: "Duffel Bag", description: "Spacious duffel bag for gym and weekend trips.", price: 399, stock: 17, imageUrl: placeholder("Duffel Bag"), category: "accessories" },
  { name: "Keychain", description: "Metal keychain with a bottle opener.", price: 49, stock: 90, imageUrl: placeholder("Keychain"), category: "accessories" },
  { name: "Lunch Box", description: "Leak-proof lunch box with two compartments.", price: 119, stock: 42, imageUrl: placeholder("Lunch Box"), category: "accessories" },
  { name: "Cable Organizer Pouch", description: "Travel pouch for chargers, cables and earphones.", price: 99, stock: 48, imageUrl: placeholder("Cable Organizer Pouch"), category: "accessories" },
];

export const users = [
  { name: "SimpleShop Admin", email: "admin@example.com", password: "admin123", role: "ADMIN" },
  { name: "Demo User", email: "user@example.com", password: "user123", role: "USER" },
];
