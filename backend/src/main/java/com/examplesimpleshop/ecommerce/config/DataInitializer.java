package com.examplesimpleshop.ecommerce.config;

import com.examplesimpleshop.ecommerce.entity.Category;
import com.examplesimpleshop.ecommerce.entity.Product;
import com.examplesimpleshop.ecommerce.entity.Role;
import com.examplesimpleshop.ecommerce.entity.User;
import com.examplesimpleshop.ecommerce.repository.CategoryRepository;
import com.examplesimpleshop.ecommerce.repository.ProductRepository;
import com.examplesimpleshop.ecommerce.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner loadSampleData(CategoryRepository categoryRepository,
                                     ProductRepository productRepository,
                                     UserRepository userRepository) {
        return args -> {
            if (categoryRepository.count() == 0) {
                Category electronics = categoryRepository.save(new Category("Electronics", "Gadgets and electronic devices"));
                Category clothing = categoryRepository.save(new Category("Clothing", "Everyday clothes and footwear"));
                Category books = categoryRepository.save(new Category("Books", "Programming and learning books"));
                Category accessories = categoryRepository.save(new Category("Accessories", "Bags and useful everyday accessories"));

                if (productRepository.count() == 0) {
                    // All prices are in Danish kroner (DKK).
                    // The frontend can show them in EUR or INR instead: see frontend/src/utils/currency.js

                    // ---- Original 10 products (with real photos) ----
                    productRepository.save(new Product(
                            "Laptop",
                            "15.6-inch laptop suitable for study, coding and office work.",
                            new BigDecimal("5999.00"), 12,
                            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
                            electronics));
                    productRepository.save(new Product(
                            "Smartphone",
                            "Modern smartphone with a bright display and reliable battery.",
                            new BigDecimal("2999.00"), 20,
                            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
                            electronics));
                    productRepository.save(new Product(
                            "Wireless Headphones",
                            "Comfortable wireless headphones for music, classes and calls.",
                            new BigDecimal("699.00"), 35,
                            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
                            electronics));
                    productRepository.save(new Product(
                            "T-Shirt",
                            "Comfortable cotton T-shirt for everyday wear.",
                            new BigDecimal("129.00"), 50,
                            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
                            clothing));
                    productRepository.save(new Product(
                            "Jeans",
                            "Classic blue denim jeans with a comfortable fit.",
                            new BigDecimal("399.00"), 30,
                            "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80",
                            clothing));
                    productRepository.save(new Product(
                            "Running Shoes",
                            "Lightweight sports shoes for walking and running.",
                            new BigDecimal("599.00"), 22,
                            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
                            clothing));
                    productRepository.save(new Product(
                            "Java Programming Book",
                            "Beginner-friendly Java book covering core programming concepts.",
                            new BigDecimal("299.00"), 25,
                            "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=900&q=80",
                            books));
                    productRepository.save(new Product(
                            "Spring Boot Guide",
                            "A practical introduction to building REST APIs with Spring Boot.",
                            new BigDecimal("349.00"), 18,
                            "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
                            books));
                    productRepository.save(new Product(
                            "Laptop Backpack",
                            "Water-resistant backpack with a dedicated laptop compartment.",
                            new BigDecimal("349.00"), 28,
                            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
                            accessories));
                    productRepository.save(new Product(
                            "Travel Wallet",
                            "Compact wallet for cards, cash and travel documents.",
                            new BigDecimal("149.00"), 40,
                            "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80",
                            accessories));

                    // ---- 50 additional products (placeholder images showing the product name) ----

                    // Electronics (13)
                    addProduct(productRepository, "Bluetooth Speaker", "Portable speaker with deep bass and 10 hours of battery life.", "399.00", 40, electronics);
                    addProduct(productRepository, "Smartwatch", "Fitness tracking, notifications and heart-rate monitoring on your wrist.", "1299.00", 25, electronics);
                    addProduct(productRepository, "Tablet", "10-inch tablet for reading, streaming and note-taking.", "2499.00", 15, electronics);
                    addProduct(productRepository, "USB-C Charger", "Fast 65W USB-C charger for laptops and phones.", "249.00", 60, electronics);
                    addProduct(productRepository, "Power Bank", "10000 mAh power bank with two USB ports.", "199.00", 45, electronics);
                    addProduct(productRepository, "Wireless Mouse", "Quiet wireless mouse with long battery life.", "149.00", 50, electronics);
                    addProduct(productRepository, "Mechanical Keyboard", "Tactile mechanical keyboard with backlit keys.", "599.00", 20, electronics);
                    addProduct(productRepository, "27-inch Monitor", "Full HD IPS monitor with thin bezels.", "1499.00", 10, electronics);
                    addProduct(productRepository, "HD Webcam", "1080p webcam with built-in microphone for online classes.", "399.00", 18, electronics);
                    addProduct(productRepository, "External SSD 1TB", "Fast and compact 1TB portable SSD.", "799.00", 14, electronics);
                    addProduct(productRepository, "Wireless Earbuds", "True wireless earbuds with charging case.", "499.00", 35, electronics);
                    addProduct(productRepository, "Gaming Controller", "Wireless controller compatible with PC and mobile.", "449.00", 16, electronics);
                    addProduct(productRepository, "Smart LED Bulb", "Color-changing LED bulb controlled from your phone.", "99.00", 70, electronics);

                    // Clothing (12)
                    addProduct(productRepository, "Hoodie", "Warm fleece hoodie with front pocket.", "299.00", 30, clothing);
                    addProduct(productRepository, "Denim Jacket", "Classic denim jacket for all seasons.", "499.00", 15, clothing);
                    addProduct(productRepository, "Formal Shirt", "Slim-fit cotton shirt for office and events.", "279.00", 35, clothing);
                    addProduct(productRepository, "Chinos", "Comfortable stretch chinos for everyday wear.", "349.00", 28, clothing);
                    addProduct(productRepository, "Polo Shirt", "Breathable cotton polo shirt.", "199.00", 40, clothing);
                    addProduct(productRepository, "Sneakers", "Casual white sneakers that go with everything.", "699.00", 20, clothing);
                    addProduct(productRepository, "Rain Jacket", "Lightweight waterproof jacket with hood.", "449.00", 18, clothing);
                    addProduct(productRepository, "Woollen Sweater", "Soft knitted sweater for cold days.", "399.00", 22, clothing);
                    addProduct(productRepository, "Track Pants", "Relaxed track pants for sports and home.", "229.00", 34, clothing);
                    addProduct(productRepository, "Cotton Socks (Pack of 5)", "Everyday cotton socks in mixed colors.", "79.00", 80, clothing);
                    addProduct(productRepository, "Winter Cap", "Knitted beanie to keep you warm.", "99.00", 55, clothing);
                    addProduct(productRepository, "Sandals", "Comfortable sandals for summer and travel.", "249.00", 30, clothing);

                    // Books (12)
                    addProduct(productRepository, "Python Programming Book", "Learn Python step by step with simple examples.", "279.00", 26, books);
                    addProduct(productRepository, "Data Structures and Algorithms", "Arrays, lists, trees and sorting explained clearly.", "349.00", 20, books);
                    addProduct(productRepository, "Web Development with HTML and CSS", "Build your first websites from scratch.", "249.00", 24, books);
                    addProduct(productRepository, "JavaScript for Beginners", "Core JavaScript concepts with hands-on exercises.", "269.00", 22, books);
                    addProduct(productRepository, "React Handbook", "Components, state and hooks for modern web apps.", "299.00", 18, books);
                    addProduct(productRepository, "SQL Basics", "Write queries, joins and simple database designs.", "229.00", 25, books);
                    addProduct(productRepository, "Clean Code Practices", "How to write readable and maintainable code.", "399.00", 15, books);
                    addProduct(productRepository, "Computer Networks Explained", "TCP/IP, HTTP and the internet made simple.", "299.00", 17, books);
                    addProduct(productRepository, "Introduction to Machine Learning", "Beginner-friendly overview of ML concepts and models.", "429.00", 14, books);
                    addProduct(productRepository, "Git and GitHub Guide", "Version control for individuals and teams.", "179.00", 30, books);
                    addProduct(productRepository, "Operating Systems Basics", "Processes, memory and file systems explained.", "299.00", 16, books);
                    addProduct(productRepository, "Software Testing Fundamentals", "Unit tests, integration tests and test planning.", "279.00", 19, books);

                    // Accessories (13)
                    addProduct(productRepository, "Leather Belt", "Genuine leather belt with metal buckle.", "199.00", 38, accessories);
                    addProduct(productRepository, "Sunglasses", "UV-protected sunglasses with a classic frame.", "249.00", 27, accessories);
                    addProduct(productRepository, "Water Bottle", "Insulated steel bottle that keeps drinks cold for 24 hours.", "149.00", 60, accessories);
                    addProduct(productRepository, "Laptop Sleeve", "Padded sleeve for 13 to 15-inch laptops.", "179.00", 32, accessories);
                    addProduct(productRepository, "Phone Case", "Shock-absorbing case with a slim profile.", "99.00", 65, accessories);
                    addProduct(productRepository, "Travel Pillow", "Memory-foam neck pillow for long journeys.", "149.00", 24, accessories);
                    addProduct(productRepository, "Umbrella", "Compact foldable umbrella with automatic open.", "129.00", 36, accessories);
                    addProduct(productRepository, "Wristwatch", "Analog wristwatch with stainless steel strap.", "899.00", 12, accessories);
                    addProduct(productRepository, "Desk Organizer", "Keep pens, notes and gadgets tidy on your desk.", "149.00", 29, accessories);
                    addProduct(productRepository, "Duffel Bag", "Spacious duffel bag for gym and weekend trips.", "399.00", 17, accessories);
                    addProduct(productRepository, "Keychain", "Metal keychain with a bottle opener.", "49.00", 90, accessories);
                    addProduct(productRepository, "Lunch Box", "Leak-proof lunch box with two compartments.", "119.00", 42, accessories);
                    addProduct(productRepository, "Cable Organizer Pouch", "Travel pouch for chargers, cables and earphones.", "99.00", 48, accessories);
                }
            }

            if (userRepository.count() == 0) {
                userRepository.save(new User("SimpleShop Admin", "admin@example.com", "admin123", Role.ADMIN));
                userRepository.save(new User("Demo User", "user@example.com", "user123", Role.USER));
            }
        };
    }

    /**
     * Small helper so each extra product fits on one line.
     * The image is a placeholder that shows the product name.
     */
    private static void addProduct(ProductRepository productRepository,
                                   String name,
                                   String description,
                                   String price,
                                   int stock,
                                   Category category) {
        String imageUrl = "https://placehold.co/900x650?text="
                + URLEncoder.encode(name, StandardCharsets.UTF_8);
        productRepository.save(new Product(name, description, new BigDecimal(price), stock, imageUrl, category));
    }
}
