"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import MotionFade from '@/components/animations/MotionFade';
import PageTransition from '@/components/animations/PageTransition';
import Link from 'next/link';
import SearchSection from '@/components/common/SearchSection';
import GridSection from '@/components/common/GridSection';
import { Skeleton } from '@/components/ui/skeleton';
import NotFound from '@/components/ui/NotFound';
import { useTranslations } from 'next-intl';
import { Filter, X } from 'lucide-react';

export default function BrandPhonesClient({ 
  initialPhones = [], 
  brand = '',
  isLoading: initialLoading = false, 
  error: initialError = null 
}) {
  const t = useTranslations('phones');
  const [sortOrder, setSortOrder] = useState('default');
  const [filteredPhones, setFilteredPhones] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [storage, setStorage] = useState('all');
  const [ram, setRam] = useState('all');
  const [availability, setAvailability] = useState('all');
  const [discount, setDiscount] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const brandPhones = initialPhones || [];

  useEffect(() => {
    let phones = [...brandPhones];
    if (priceRange.max === 0) {
      setPriceRange({ 
        min: 0, 
        max: brandPhones?.reduce((max, phone) => Math.max(max, parseFloat(phone.final_price || phone.main_amount || 0)), 0) || 0 
      });
    }
    
    // Apply search filter
    if (searchQuery && typeof searchQuery === 'string') {
      phones = phones.filter(phone =>
        phone.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        phone.brand_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply price range filter
    phones = phones.filter(phone => {
      const price = parseFloat(phone.final_price || phone.main_amount || 0);
      return price >= priceRange.min && price <= priceRange.max;
    });

    // Apply storage filter
    if (storage !== 'all') {
      phones = phones.filter(phone => phone.memory === storage);
    }

    // Apply RAM filter
    if (ram !== 'all') {
      phones = phones.filter(phone => phone.ram === ram);
    }

    // Apply availability filter
    if (availability !== 'all') {
      if (availability === 'in_stock') {
        phones = phones.filter(phone => phone.is_in_stock === true);
      } else if (availability === 'out_of_stock') {
        phones = phones.filter(phone => phone.is_in_stock === false);
      }
    }

    // Apply discount filter
    if (discount !== 'all') {
      if (discount === 'with_discount') {
        phones = phones.filter(phone => parseFloat(phone.discount_percentage || 0) > 0);
      } else if (discount === 'no_discount') {
        phones = phones.filter(phone => parseFloat(phone.discount_percentage || 0) === 0);
      }
    }

    // Apply sorting
    phones.sort((a, b) => {
      const priceA = parseFloat(a.final_price || a.main_amount || 0);
      const priceB = parseFloat(b.final_price || b.main_amount || 0);
      
      if (sortOrder === 'default') {
        const rankA = parseFloat(a.rank || 0);
        const rankB = parseFloat(b.rank || 0);
        if (rankB !== rankA) {
          return rankB - rankA;
        }
        return priceA - priceB;
      } else if (sortOrder === 'desc') {
        return priceB - priceA;
      } else {
        return priceA - priceB;
      }
    });

    setFilteredPhones(phones);
  }, [brandPhones, searchQuery, sortOrder, priceRange.min, priceRange.max, storage, ram, availability, discount]);

  // Disable body scroll when drawer is open
  useEffect(() => {
    if (isFilterDrawerOpen) {
      // Save the current scroll position
      const scrollY = window.scrollY;
      // Disable scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scroll
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      // Restore scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup function
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isFilterDrawerOpen]);

  if (initialLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen relative overflow-hidden bg-primary">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8 my-12">
              <div className="lg:w-1/4 min-w-[280px]">
                <div className="bg-gradient-to-br from-gray-100/40 to-gray-300/40 backdrop-blur-sm rounded-xl p-6 border border-gray-600/20">
                  <Skeleton className="h-6 w-20 mb-6 bg-gray-200" />
                  <div className="space-y-6">
                    <Skeleton className="h-16 w-full bg-gray-200" />
                    <Skeleton className="h-16 w-full bg-gray-200" />
                    <Skeleton className="h-16 w-full bg-gray-200" />
                  </div>
                </div>
              </div>
              <div className="lg:w-3/4">
                <div className="max-h-[80vh] overflow-y-auto pr-2 py-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                      <Skeleton key={item} className="h-80 w-full bg-gradient-to-br from-gray-100/40 to-gray-300/40" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (initialError) {
    return (
      <PageTransition>
        <div className="min-h-screen relative overflow-hidden bg-primary">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-secondary">{t('errorLoadingPhones')}</h2>
                <p className="text-gray-600">{t('couldntLoadPhones')}</p>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (brandPhones.length === 0) {
    return (
      <PageTransition>
        <div className="min-h-screen relative overflow-hidden bg-primary">
          <div className="container mx-auto px-4 py-8">
            <NotFound
              title={t('noPhonesFound')}
              description={t('noPhonesForBrand', { brand: brand.charAt(0).toUpperCase() + brand.slice(1) })}
              showSearch={true}
              searchTerm=""
              onClearSearch={() => setSearchQuery('')}
              primaryAction={{
                text: t('browseAllBrands'),
                href: "/phones",
                onClick: () => { }
              }}
              secondaryAction={{
                text: t('tryRepairServices'),
                href: "/repair",
                onClick: () => { }
              }}
            />
          </div>
        </div>
      </PageTransition>
    );
  }

  // Render filter content (reusable for both desktop and mobile)
  const renderFilterContent = () => (
    <>
      {/* Price Sort */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-600 mb-3">{t('sortByPrice')}</label>
        <select
          className="cursor-pointer w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-white text-gray-600"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="default">{t('default')}</option>
          <option value="desc">{t('priceHighToLow')}</option>
          <option value="asc">{t('priceLowToHigh')}</option>
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-600 mb-3">{t('priceRange')}</label>
        <input
          type="range"
          min="0"
          max={brandPhones.reduce((max, phone) => Math.max(max, parseFloat(phone.final_price || phone.main_amount || 0)), 0)}
          step="100"
          value={priceRange.max}
          onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
          className="w-full accent-secondary cursor-pointer"
        />
        <div className="flex justify-between text-gray-600 text-sm mt-2">
          <span>€{priceRange.min.toLocaleString()}</span>
          <span>€{priceRange.max.toLocaleString()}</span>
        </div>
      </div>

      {/* Storage Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-600 mb-3">{t('storage')}</label>
        <select
          className="cursor-pointer w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-white text-gray-600"
          value={storage}
          onChange={(e) => setStorage(e.target.value)}
        >
          <option value="all">{t('allStorage')}</option>
          <option value="64">64GB</option>
          <option value="128">128GB</option>
          <option value="256">256GB</option>
          <option value="512">512GB</option>
          <option value="1024">1TB</option>
        </select>
      </div>

      {/* RAM Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-600 mb-3">{t('ram')}</label>
        <select
          className="cursor-pointer w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-white text-gray-600"
          value={ram}
          onChange={(e) => setRam(e.target.value)}
        >
          <option value="all">{t('allRam')}</option>
          <option value="4">4GB</option>
          <option value="6">6GB</option>
          <option value="8">8GB</option>
          <option value="12">12GB</option>
          <option value="16">16GB</option>
          <option value="18">18GB</option>
        </select>
      </div>

      {/* Availability Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-600 mb-3">{t('availability')}</label>
        <select
          className="cursor-pointer w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-white text-gray-600"
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
        >
          <option value="all">{t('allPhones')}</option>
          <option value="in_stock">{t('inStock')}</option>
          <option value="out_of_stock">{t('outOfStock')}</option>
        </select>
      </div>

      {/* Clear Filters Button */}
      <div className="mb-6">
        <button
          onClick={() => {
            setSearchQuery('');
            setSortOrder('default');
            const maxPrice = brandPhones?.reduce((max, phone) => Math.max(max, parseFloat(phone.final_price || phone.main_amount || 0)), 0) || 0;
            setPriceRange({ min: 0, max: maxPrice });
            setStorage('all');
            setRam('all');
            setAvailability('all');
            setDiscount('all');
            setIsFilterDrawerOpen(false);
          }}
          className="cursor-pointer w-full p-3 bg-gray-200 text-secondary border border-gray-300 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
        >
          {t('clearAllFilters')}
        </button>
      </div>
    </>
  );

  return (
    <PageTransition>
      <div className="min-h-screen relative overflow-hidden bg-primary">
        <div className="container mx-auto px-4">
          {/* Search bar and Mobile Filter Button */}
          <div className='flex justify-between items-center gap-4 my-4'>
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-secondary text-primary rounded-lg hover:bg-secondary/90 transition-colors font-medium"
            >
              <Filter size={20} />
              <span>{t('filters')}</span>
            </button>
            <SearchSection
              className='p-0 m-0 flex-1'
              placeholder={t('searchByModel')}
              searchTerm={searchQuery}
              onSearchChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Mobile Filter Drawer Backdrop */}
          {isFilterDrawerOpen && (
            <div
              className="fixed inset-0 z-[9998] lg:hidden bg-black/50 transition-opacity"
              onClick={() => setIsFilterDrawerOpen(false)}
            />
          )}

          {/* Mobile Filter Drawer */}
          <div
            className={`
              fixed top-0 right-0 h-full w-80 max-w-[85vw] z-[9999] bg-white backdrop-blur-sm shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto
              ${isFilterDrawerOpen ? 'translate-x-0' : 'translate-x-full'}
            `}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6 mt-20">
                <h3 className="text-xl font-bold text-secondary">{t('filters')}</h3>
                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>
              {/* Filter Content - Reused from Desktop Sidebar */}
              {renderFilterContent()}
            </div>
          </div>

          {/* Filter and Grid Section */}
          <div className="flex flex-col lg:flex-row gap-8 my-10">
            {/* Filter Sidebar - Desktop Only */}
            <MotionFade delay={0.2} immediate={true}>
              <div className="hidden lg:block lg:w-1/4 min-w-[280px] lg:sticky lg:top-24 lg:h-[calc(90vh-8rem)]">
                <div className="bg-gradient-to-br from-gray-100/40 to-gray-300/40 backdrop-blur-sm rounded-xl p-6 border border-gray-600/20 h-full overflow-y-auto scrollbar-hide">
                  <h3 className="text-xl font-bold text-secondary mb-6">{t('filters')}</h3>
                  {renderFilterContent()}
                </div>
              </div>
            </MotionFade>

            {/* Phones Grid - Scrollable */}
            <div className="w-full lg:w-3/4">
              <div className="max-h-[80vh] overflow-y-auto pr-2 " style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}>
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                <GridSection
                  items={filteredPhones}
                  isLoading={false}
                  gridCols="grid-cols-2 lg:grid-cols-4"
                  renderItem={(phone, index) => (
                    <Link href={`/phones/${brand}/${phone.id}`} key={phone.id}>
                      <MotionFade delay={0.3 + index * 0.1} immediate={true}>
                        <div className="group bg-gradient-to-br from-gray-100/40 to-gray-300/40 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-600/20 hover:border-secondary/50 h-full overflow-hidden">
                          <div className="p-6 text-center h-full flex flex-col">
                            <div className="mb-6 bg-white rounded-xl border p-6 group-hover:from-gray-400/20 group-hover:to-gray-600/20 transition-all duration-500 relative overflow-hidden">
                              <Image
                                src={phone.icon || '/SAMSUNG_GalaxyS23Ultra.png'}
                                alt={phone.name}
                                width={160}
                                height={160}
                                className="w-full h-40 object-contain group-hover:scale-105 transition-transform duration-300 relative z-10"
                              />
                            </div>

                            <div className="flex-grow flex flex-col justify-between">
                              <h3 className="font-bold text-lg text-secondary group-hover:text-secondary transition-colors duration-300 mb-3">
                                {phone.name}
                              </h3>

                              <div className="space-y-2">
                                <p className="text-gray-600 text-sm">{phone.memory}GB - {phone.ram}GB RAM</p>
                                <div className="space-y-1">
                                  <p className="text-lg text-gray-600 flex items-center justify-center gap-2">
                                    {phone.discount_percentage && parseFloat(phone.discount_percentage) > 0 && (
                                      <span className="text-xs text-green-600">
                                        {parseFloat(phone.discount_percentage).toFixed(1)}% off
                                      </span>
                                    )}
                                    <span className='font-bold text-secondary'>€{parseFloat(phone.final_price).toLocaleString()}</span>
                                    {phone.discounted_amount && phone.discounted_amount !== phone.main_amount && (
                                      <span className="text-sm text-gray-400 line-through">
                                        €{parseFloat(phone.main_amount).toLocaleString()}
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </MotionFade>
                    </Link>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

