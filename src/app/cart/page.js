"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PageTransition from '@/components/animations/PageTransition';
import MotionFade from '@/components/animations/MotionFade';
import HeroSection from '@/components/common/HeroSection';
import { CustomButton } from '@/components/ui/button';
import { Trash2, Plus, Minus, ShoppingBag, Home, ShoppingCart } from 'lucide-react';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load cart from localStorage
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const cart = JSON.parse(savedCart);
          setCartItems(cart);
        } catch (error) {
          console.error('Error parsing cart data:', error);
        }
      }
      setIsLoading(false);
    }
  }, []);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(itemId);
      return;
    }
    
    const updatedCart = cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace('$', ''));
      return total + (price * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-primary text-secondary flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-accent">Loading cart...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen relative overflow-hidden bg-primary text-secondary">
        <div className="container mx-auto px-4 py-8">
          
          {/* Hero Section */}
          <HeroSection
            title="Your"
            subtitle="Shopping Cart"
            description="Review your selected accessories and proceed to checkout."
            image="/Accessories.png"
            imageAlt="Shopping Cart"
            badgeText="Cart Items"
            backButtonText="← Continue Shopping"
            showBackButton={true}
            backButtonHref="/accessories"
          />

          {/* Breadcrumb Navigation */}
          <MotionFade delay={0.1}>
            <Breadcrumb
              items={[
                { label: 'Home', href: '/', icon: Home },
                { label: 'Cart', icon: ShoppingCart }
              ]}
              className="mb-6"
            />
          </MotionFade>

          {cartItems.length === 0 ? (
            <MotionFade delay={0.1}>
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="w-12 h-12 text-accent/60" />
                </div>
                <h2 className="text-2xl font-bold text-accent mb-4">Your cart is empty</h2>
                <p className="text-accent/80 mb-8">Looks like you haven&apos;t added any accessories to your cart yet.</p>
                <Link href="/accessories">
                  <CustomButton className="bg-secondary text-primary hover:bg-secondary/90 px-8 py-3">
                    Start Shopping
                  </CustomButton>
                </Link>
              </div>
            </MotionFade>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-accent">
                    Cart Items ({getTotalItems()})
                  </h2>
                  <button
                    onClick={clearCart}
                    className="text-red-400 hover:text-red-300 text-sm flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear Cart
                  </button>
                </div>

                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <MotionFade key={item.id} delay={0.1 + (index * 0.05)}>
                      <div className="bg-white/10 backdrop-blur-sm border border-accent/20 rounded-lg p-4">
                        <div className="flex items-center gap-4">
                          {/* Product Image */}
                          <div className="w-20 h-20 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Image
                              src={item.image || '/Accessories.png'}
                              alt={item.name}
                              width={60}
                              height={60}
                              className="object-contain"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-grow min-w-0">
                            <h3 className="font-semibold text-accent mb-1 truncate">
                              {item.name}
                            </h3>
                            <p className="text-sm text-accent/80 mb-2">
                              {item.category}
                            </p>
                            {item.variants && Object.keys(item.variants).length > 0 && (
                              <div className="text-xs text-accent/60 mb-2">
                                {Object.entries(item.variants).map(([key, value]) => (
                                  <span key={key} className="mr-2">
                                    {key}: {value}
                                  </span>
                                ))}
                              </div>
                            )}
                            <div className="text-lg font-bold text-secondary">
                              {item.price}
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 rounded-full bg-white/10 border border-accent/30 flex items-center justify-center hover:bg-white/20 transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="text-accent font-medium min-w-[2rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 rounded-full bg-white/10 border border-accent/30 flex items-center justify-center hover:bg-white/20 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-red-400 hover:text-red-300 p-2"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </MotionFade>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <MotionFade delay={0.2}>
                  <div className="bg-white/10 backdrop-blur-sm border border-accent/20 rounded-lg p-6 sticky top-8">
                    <h3 className="text-lg font-semibold text-accent mb-4">Order Summary</h3>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-accent">
                        <span>Subtotal ({getTotalItems()} items)</span>
                        <span>${getTotalPrice().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-accent">
                        <span>Shipping</span>
                        <span className="text-green-400">Free</span>
                      </div>
                      <div className="flex justify-between text-accent">
                        <span>Tax</span>
                        <span>${(getTotalPrice() * 0.1).toFixed(2)}</span>
                      </div>
                      <div className="border-t border-accent/20 pt-3">
                        <div className="flex justify-between text-lg font-bold text-secondary">
                          <span>Total</span>
                          <span>${(getTotalPrice() * 1.1).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <CustomButton className="w-full bg-secondary text-primary hover:bg-secondary/90 py-3">
                        Proceed to Checkout
                      </CustomButton>
                      <Link href="/accessories">
                        <CustomButton variant="outline" className="w-full border-accent/30 text-accent hover:bg-white/10 py-3">
                          Continue Shopping
                        </CustomButton>
                      </Link>
                    </div>

                    <div className="mt-6 text-xs text-accent/60 text-center">
                      <p>✓ 30-day warranty on all accessories</p>
                      <p>✓ Free shipping on orders over $50</p>
                      <p>✓ Secure checkout</p>
                    </div>
                  </div>
                </MotionFade>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
