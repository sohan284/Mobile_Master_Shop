"use client";
import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

const CartIcon = () => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Load cart from localStorage
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const cart = JSON.parse(savedCart);
          setCartItems(cart);
          setCartCount(cart.length);
        } catch (error) {
          console.error('Error parsing cart data:', error);
        }
      }
    }
  }, []);

  // Listen for cart updates
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'cart') {
        try {
          const cart = JSON.parse(e.newValue || '[]');
          setCartItems(cart);
          setCartCount(cart.length);
        } catch (error) {
          console.error('Error parsing cart data:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Link href="/cart" className="relative group">
      <div className="flex items-center justify-center w-10 h-10 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
        <ShoppingCart className="w-5 h-5 text-accent group-hover:text-secondary transition-colors" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-secondary text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        )}
      </div>
    </Link>
  );
};

export default CartIcon;

