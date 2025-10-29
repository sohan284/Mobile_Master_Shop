"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Heart } from 'lucide-react';

const ProductCard = ({ 
  product, 
  onAddToCart, 
  onAddToWishlist, 
  className = "" 
}) => {
  const {
    id,
    name,
    description,
    price,
    originalPrice,
    image,
    rating = 4.5,
    reviews = 0,
    inStock = true,
    features = [],
    category
  } = product;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToWishlist) {
      onAddToWishlist(product);
    }
  };

  return (
    <div className={`group relative bg-white/10 backdrop-blur-sm border border-accent/20 rounded-lg p-4 hover:border-secondary/50 hover:shadow-lg transition-all duration-300 cursor-pointer ${className}`}>
      <Link href={`/accessories/${category?.toLowerCase().replace(/\s+/g, '-')}/${id}`}>
        <div className="flex flex-col h-full">
          {/* Product Image */}
          <div className="flex justify-center mb-4 relative">
            <div className="w-20 h-20 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <Image
                src={image || '/Accessories.png'}
                alt={name}
                width={60}
                height={60}
                className="object-contain"
              />
            </div>
            
            {/* Wishlist Button */}
            <button
              onClick={handleAddToWishlist}
              className="absolute top-2 right-2 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/30"
            >
              <Heart className="w-4 h-4 text-accent" />
            </button>
            
            {/* Discount Badge */}
            {originalPrice && originalPrice !== price && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                Sale
              </div>
            )}
          </div>
          
          {/* Product Name */}
          <h3 className="text-sm font-semibold text-accent mb-2 group-hover:text-secondary transition-colors text-center line-clamp-2">
            {name}
          </h3>
          
          {/* Product Description */}
          <p className="text-xs text-accent/80 mb-3 line-clamp-2 flex-grow">
            {description}
          </p>
          
          {/* Rating */}
          <div className="flex items-center justify-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-accent/30'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-accent/60 ml-1">
              ({reviews})
            </span>
          </div>
          
          {/* Price */}
          <div className="flex items-center justify-center mb-3">
            <div className="text-lg font-bold text-secondary">
              {price}
            </div>
            {originalPrice && originalPrice !== price && (
              <div className="text-sm text-accent/60 line-through ml-2">
                {originalPrice}
              </div>
            )}
          </div>
          
          {/* Features */}
          {features && features.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3 justify-center">
              {features.slice(0, 2).map((feature, index) => (
                <span key={index} className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">
                  {feature}
                </span>
              ))}
            </div>
          )}
          
          {/* Stock Status */}
          <div className="flex items-center justify-center mb-3">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              inStock ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className="text-xs text-accent/80">
              {inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              inStock
                ? 'bg-secondary text-primary hover:bg-secondary/90'
                : 'bg-accent/20 text-accent/50 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </div>
          </button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;

