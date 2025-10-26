'use client';
import React, { use, useEffect, useState } from 'react'
import Image from 'next/image';
import MotionFade from '@/components/animations/MotionFade';
import PageTransition from '@/components/animations/PageTransition';
import Link from 'next/link';

const dummyPhones = {
  apple: [
    { id: 1, model: 'iPhone 16 Pro Max', price: 1199, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '256GB', color: 'Natural Titanium' },
    { id: 2, model: 'iPhone 16 Pro', price: 1099, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '128GB', color: 'Blue Titanium' },
    { id: 3, model: 'iPhone 16 Plus', price: 899, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '128GB', color: 'Pink' },
    { id: 4, model: 'iPhone 16', price: 799, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '128GB', color: 'Midnight' },
    { id: 5, model: 'iPhone 15 Pro Max', price: 1099, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '256GB', color: 'Black Titanium' },
    { id: 6, model: 'iPhone 15', price: 699, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '128GB', color: 'Green' },
    { id: 7, model: 'iPhone 14 Pro', price: 899, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '256GB', color: 'Deep Purple' },
    { id: 8, model: 'iPhone 13', price: 599, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '128GB', color: 'Blue' },
    { id: 9, model: 'iPhone SE (2022)', price: 429, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '64GB', color: 'Red' },
    { id: 10, model: 'iPhone 12', price: 499, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '64GB', color: 'White' },
  ],

  samsung: [
    { id: 1, model: 'Galaxy S24 Ultra', price: 1299, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '512GB', color: 'Titanium Gray' },
    { id: 2, model: 'Galaxy S24+', price: 999, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '256GB', color: 'Cobalt Violet' },
    { id: 3, model: 'Galaxy S24', price: 799, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '128GB', color: 'Amber Yellow' },
    { id: 4, model: 'Galaxy Z Fold 6', price: 1899, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '512GB', color: 'Navy' },
    { id: 5, model: 'Galaxy Z Flip 6', price: 1099, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '256GB', color: 'Mint' },
    { id: 6, model: 'Galaxy A55', price: 449, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '128GB', color: 'Ice Blue' },
    { id: 7, model: 'Galaxy A35', price: 349, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '128GB', color: 'Navy' },
    { id: 8, model: 'Galaxy M55', price: 299, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '128GB', color: 'Light Green' },
    { id: 9, model: 'Galaxy S23 Ultra', price: 999, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '256GB', color: 'Black' },
    { id: 10, model: 'Galaxy F15', price: 199, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '64GB', color: 'Lavender' },
  ],

  google: [
    { id: 1, model: 'Pixel 9 Pro XL', price: 1099, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '512GB', color: 'Porcelain' },
    { id: 2, model: 'Pixel 9 Pro', price: 999, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '256GB', color: 'Hazel' },
    { id: 3, model: 'Pixel 9', price: 799, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '128GB', color: 'Obsidian' },
    { id: 4, model: 'Pixel 8 Pro', price: 899, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '256GB', color: 'Bay' },
    { id: 5, model: 'Pixel 8', price: 699, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '128GB', color: 'Rose' },
    { id: 6, model: 'Pixel 7a', price: 499, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '128GB', color: 'Sea' },
    { id: 7, model: 'Pixel Fold', price: 1799, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '256GB', color: 'Obsidian' },
    { id: 8, model: 'Pixel 6a', price: 399, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '128GB', color: 'Chalk' },
    { id: 9, model: 'Pixel 5', price: 299, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '128GB', color: 'Just Black' },
    { id: 10, model: 'Pixel 4 XL', price: 249, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '64GB', color: 'Clearly White' },
  ],

  oneplus: [
    { id: 1, model: 'OnePlus 13', price: 899, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '256GB', color: 'Emerald Dust' },
    { id: 2, model: 'OnePlus 12', price: 799, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '256GB', color: 'Glacial Silver' },
    { id: 3, model: 'OnePlus 12R', price: 649, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '128GB', color: 'Iron Gray' },
    { id: 4, model: 'OnePlus 11', price: 699, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '128GB', color: 'Eternal Green' },
    { id: 5, model: 'OnePlus Nord 4', price: 449, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '128GB', color: 'Mint' },
    { id: 6, model: 'OnePlus Nord CE 3 Lite', price: 299, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '128GB', color: 'Pastel Lime' },
    { id: 7, model: 'OnePlus Ace 3', price: 699, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '256GB', color: 'Blue Tide' },
    { id: 8, model: 'OnePlus Open', price: 1699, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '512GB', color: 'Voyager Black' },
    { id: 9, model: 'OnePlus 10 Pro', price: 549, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '256GB', color: 'Volcanic Black' },
    { id: 10, model: 'OnePlus 9', price: 499, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '128GB', color: 'Arctic Sky' },
  ],

  xiaomi: [
    { id: 1, model: 'Xiaomi 14 Ultra', price: 999, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '512GB', color: 'Black' },
    { id: 2, model: 'Xiaomi 14 Pro', price: 899, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '512GB', color: 'White' },
    { id: 3, model: 'Xiaomi 13T Pro', price: 699, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '256GB', color: 'Meadow Green' },
    { id: 4, model: 'Redmi Note 13 Pro+', price: 399, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '256GB', color: 'Aurora Purple' },
    { id: 5, model: 'Redmi Note 13', price: 299, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '128GB', color: 'Blue' },
    { id: 6, model: 'Poco F6 Pro', price: 549, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '256GB', color: 'Black' },
    { id: 7, model: 'Poco X6 Pro', price: 399, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '128GB', color: 'Grey' },
    { id: 8, model: 'Mi 12', price: 499, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '128GB', color: 'Blue' },
    { id: 9, model: 'Mi 11 Lite', price: 299, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '64GB', color: 'Peach Pink' },
    { id: 10, model: 'Mi Mix Fold 3', price: 1599, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '512GB', color: 'Carbon Black' },
  ],

  huawei: [
    { id: 1, model: 'Huawei P70 Pro', price: 1099, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '512GB', color: 'Golden' },
    { id: 2, model: 'Huawei Mate 60 Pro', price: 1299, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '512GB', color: 'Emerald' },
    { id: 3, model: 'Huawei Nova 11', price: 699, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '256GB', color: 'Silver' },
    { id: 4, model: 'Huawei P60', price: 799, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '256GB', color: 'Black' },
    { id: 5, model: 'Huawei Mate X3', price: 1799, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '1TB', color: 'Blue' },
    { id: 6, model: 'Huawei P50 Pro', price: 999, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '256GB', color: 'White' },
    { id: 7, model: 'Huawei Mate 50', price: 899, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '256GB', color: 'Red' },
    { id: 8, model: 'Huawei Y9a', price: 299, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '128GB', color: 'Green' },
    { id: 9, model: 'Huawei Honor 50', price: 499, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '256GB', color: 'Black' },
    { id: 10, model: 'Huawei MatePad Pro', price: 799, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '512GB', color: 'Gray' },
  ],

  motorola: [
    { id: 1, model: 'Moto Edge 40', price: 699, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '256GB', color: 'Metallic Silver' },
    { id: 2, model: 'Moto G73', price: 299, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '128GB', color: 'Gray' },
    { id: 3, model: 'Moto Edge 50 Fusion', price: 599, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '256GB', color: 'Tidal Teal' },
    { id: 4, model: 'Moto G Stylus 5G (2024)', price: 449, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '128GB', color: 'Steel Blue' },
    { id: 5, model: 'Moto G Power 5G (2025)', price: 349, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '128GB', color: 'Mineral Black' },
    { id: 6, model: 'Moto G54', price: 299, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '128GB', color: 'Midnight Blue' },
    { id: 7, model: 'Moto G34', price: 199, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '64GB', color: 'Ice Green' },
    { id: 8, model: 'Moto Razr 50 Ultra', price: 1199, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '256GB', color: 'Viva Magenta' },
    { id: 9, model: 'Moto E14', price: 149, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '64GB', color: 'Graphite Gray' },
    { id: 10, model: 'Moto G85', price: 449, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '128GB', color: 'Olive Green' },
  ],

  sony: [
    { id: 1, model: 'Xperia 1 VI', price: 1299, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '512GB', color: 'Black' },
    { id: 2, model: 'Xperia 5 V', price: 999, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '256GB', color: 'Blue' },
    { id: 3, model: 'Xperia 10 VI', price: 499, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '128GB', color: 'Lavender' },
    { id: 4, model: 'Xperia PRO-I II', price: 1799, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '1TB', color: 'Black' },
    { id: 5, model: 'Xperia Ace IV', price: 399, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '128GB', color: 'White' },
    { id: 6, model: 'Xperia 1 V', price: 1199, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '512GB', color: 'Khaki Green' },
    { id: 7, model: 'Xperia 5 IV', price: 899, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '256GB', color: 'Violet' },
    { id: 8, model: 'Xperia 10 V', price: 449, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '128GB', color: 'Mint' },
    { id: 9, model: 'Xperia L4', price: 249, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '64GB', color: 'Black' },
    { id: 10, model: 'Xperia XZ3', price: 299, image: '/SAMSUNG_GalaxyS23Ultra.png', storage: '128GB', color: 'Forest Green' },
  ],
};




export default function BrandPage({ params }) {
  const brand = use(params).brand?.toLowerCase();

  // Add this check early in the component
  if (!dummyPhones[brand]) {
    return (
      <PageTransition>
        <div className='container  mx-auto px-4 lg:px-8 py-8'>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-[#6B7E8D]">Brand Not Found</h2>
              <p className="text-gray-600">Sorry, we couldn't find any phones for the brand "{brand}".</p>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  const [sortOrder, setSortOrder] = useState('asc');
  const [filteredPhones, setFilteredPhones] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
  const [storage, setStorage] = useState('all');

  useEffect(() => {
    let phones = [...(dummyPhones[brand] || [])];

    // Apply price range filter
    phones = phones.filter(phone =>
      phone.price >= priceRange.min && phone.price <= priceRange.max
    );

    // Apply storage filter
    if (storage !== 'all') {
      phones = phones.filter(phone => phone.storage === storage);
    }

    // Apply sorting
    phones.sort((a, b) => {
      return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
    });

    setFilteredPhones(phones);
  }, [brand, sortOrder, priceRange.min, priceRange.max, storage]);

  return (
    <PageTransition>
      <div className='container  mx-auto px-4 lg:px-8 py-8'>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 p-4">
          {/* Changed items-center to items-start */}

          {/* Filter Section */}
          <MotionFade delay={0.01}>
            <div className="w-1/4 min-w-[250px] bg-white/10  p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4 text-[#6B7E8D]">Filters</h2>

              {/* Price Sort */}
              <div className="mb-4">
                <label className="block mb-2 text-[#6B7E8D]">Sort by Price</label>
                <select
                  className="w-full p-2 border rounded hover:border-[#00bfb2] focus:outline-none focus:ring-2 focus:ring-[#00bfb2]"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="asc">Price: Low to High</option>
                  <option value="desc">Price: High to Low</option>
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="mb-4">
                <label className="block mb-2 text-[#6B7E8D]">Price Range</label>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  className="w-full accent-[#00bfb2]"
                />
                <div className="flex justify-between text-[#6B7E8D]">
                  <span>${priceRange.min}</span>
                  <span>${priceRange.max}</span>
                </div>
              </div>

              {/* Storage Filter */}
              <div className="mb-4">
                <label className="block mb-2 text-[#6B7E8D]">Storage</label>
                <select
                  className="w-full p-2 border rounded hover:border-[#00bfb2] focus:outline-none focus:ring-2 focus:ring-[#00bfb2]"
                  value={storage}
                  onChange={(e) => setStorage(e.target.value)}
                >
                  <option value="all">All Storage</option>
                  <option value="128GB">128GB</option>
                  <option value="256GB">256GB</option>
                  <option value="512GB">512GB</option>
                </select>
              </div>
            </div>
          </MotionFade>

          {/* Phones Grid */}
          <div className="w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPhones.map((phone, idx) => (
              <Link href={`/phones/${brand}/${phone.model}`} key={phone.id}>
                <MotionFade delay={0.02 + idx * 0.05}>
                  <div className="group bg-white/10  shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 hover:border-[#00bfb2] h-full overflow-hidden rounded-lg">
                    <div className="p-4 text-center h-full flex flex-col relative">
                      <div className="mb-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 group-hover:from-[#00bfb2]/5 group-hover:to-[#00bfb2]/10 transition-all duration-500 relative overflow-hidden">
                        <Image
                          src={phone.image}
                          alt={phone.model}
                          width={160}
                          height={160}
                          className="w-full h-40 object-contain group-hover:scale-105 transition-transform duration-300 relative z-10"
                        />
                      </div>

                      <div className="flex-grow flex flex-col justify-between">
                        <h3 className="font-bold text-lg text-[#6B7E8D] group-hover:text-[#00bfb2] transition-colors duration-300">
                          {phone.model}
                        </h3>

                        <div className="mt-3 space-y-2">
                          <p className="text-gray-600">{phone.storage} - {phone.color}</p>
                          <p className="text-lg">
                            from <span className='font-bold text-[#00bfb2]'>${phone.price}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </MotionFade>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
