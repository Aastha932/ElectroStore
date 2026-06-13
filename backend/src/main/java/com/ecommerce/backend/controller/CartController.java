package com.ecommerce.backend.controller;

import com.ecommerce.backend.config.UserDetailsImpl;
import com.ecommerce.backend.dto.CartItemRequest;
import com.ecommerce.backend.model.CartItem;
import com.ecommerce.backend.model.User;
import com.ecommerce.backend.service.CartService;
import com.ecommerce.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private UserService userService;

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userService.findByEmail(userDetails.getEmail())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    @GetMapping
    public ResponseEntity<List<CartItem>> getCart() {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(cartService.getCartItems(user));
    }

    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(@Valid @RequestBody CartItemRequest request) {
        User user = getAuthenticatedUser();
        CartItem cartItem = cartService.addToCart(user, request.getProductId(), request.getQuantity());
        return ResponseEntity.ok(cartItem);
    }

    @PutMapping("/update")
    public ResponseEntity<CartItem> updateCartItem(@Valid @RequestBody CartItemRequest request) {
        User user = getAuthenticatedUser();
        CartItem cartItem = cartService.updateCartItemQuantity(user, request.getProductId(), request.getQuantity());
        return ResponseEntity.ok(cartItem);
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long productId) {
        User user = getAuthenticatedUser();
        cartService.removeFromCart(user, productId);
        return ResponseEntity.ok("Item removed from cart");
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart() {
        User user = getAuthenticatedUser();
        cartService.clearCart(user);
        return ResponseEntity.ok("Cart cleared");
    }
}
