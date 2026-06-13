package com.ecommerce.backend.config;

import com.ecommerce.backend.model.Product;
import com.ecommerce.backend.model.Role;
import com.ecommerce.backend.model.User;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed Roles & Users
        if (!userRepository.existsByEmail("admin@ecommerce.com")) {
            User admin = new User(
                    "admin@ecommerce.com",
                    passwordEncoder.encode("admin123"),
                    "Admin",
                    "Store",
                    Role.ROLE_ADMIN
            );
            userRepository.save(admin);
        }

        if (!userRepository.existsByEmail("user@ecommerce.com")) {
            User user = new User(
                    "user@ecommerce.com",
                    passwordEncoder.encode("user123"),
                    "John",
                    "Doe",
                    Role.ROLE_USER
            );
            userRepository.save(user);
        }

        // Seed Products
        if (productRepository.count() == 0) {
            Product p1 = new Product(
                    "Wireless Noise-Canceling Headphones",
                    "Immerse yourself in music with industry-leading noise cancellation, 30-hour battery life, and crystal-clear audio quality.",
                    199.99,
                    50,
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop",
                    "Electronics"
            );

            Product p2 = new Product(
                    "Smart Fitness Watch",
                    "Track your workouts, heart rate, sleep quality, and receive smart notifications with this sleek and durable smartwatch.",
                    129.99,
                    100,
                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop",
                    "Electronics"
            );

            Product p3 = new Product(
                    "Premium Cotton Crewneck T-Shirt",
                    "Crafted from 100% ultra-soft cotton, this classic crewneck provides daily comfort and long-lasting durability.",
                    24.99,
                    200,
                    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop",
                    "Clothing"
            );

            Product p4 = new Product(
                    "Classic Denim Jacket",
                    "A timeless addition to your wardrobe. Made from premium rigid denim that softens with wear and ages beautifully.",
                    59.99,
                    75,
                    "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&auto=format&fit=crop",
                    "Clothing"
            );

            Product p5 = new Product(
                    "Minimalist Ceramic Mug Set",
                    "Set of four matte-finished stoneware mugs designed for comfort in hand and aesthetic pleasure at the dining table.",
                    34.99,
                    40,
                    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop",
                    "Home"
            );

            Product p6 = new Product(
                    "Electric Gooseneck Kettle",
                    "Features precision pour control, variable temperature presets, and a keep-warm function for perfect coffee or tea brewing.",
                    79.99,
                    30,
                    "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=500&auto=format&fit=crop",
                    "Home"
            );

            Product p7 = new Product(
                    "Atomic Habits",
                    "Tiny Changes, Remarkable Results. An easy and proven way to build good habits and break bad ones, by James Clear.",
                    16.99,
                    150,
                    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop",
                    "Books"
            );

            productRepository.saveAll(Arrays.asList(p1, p2, p3, p4, p5, p6, p7));
        }
    }
}
