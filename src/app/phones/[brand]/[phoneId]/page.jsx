'use client';
import React, { use, useState, useEffect, useMemo } from 'react';
import {
  CheckCircle,
  CreditCard,
  ShoppingBag,
  MapPin,
  Calendar,
  Save,
  Shield,
  ArrowLeft,
  Clock,
  Check
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApiGet } from '@/hooks/useApi';
import { apiFetcher } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import PageTransition from '@/components/animations/PageTransition';
import MotionFade from '@/components/animations/MotionFade';
import SafeImage from '@/components/ui/SafeImage';
import ReviewsSection from '@/components/common/ReviewsSection';

export default function PhoneIndividualPage({ params }) {
  const phoneId = use(params).phoneId;
  const brand = use(params).brand;
  const router = useRouter();

  // Fetch phone data from API
  const { data: phoneData, isLoading: phoneLoading, error: phoneError } = useApiGet(
    ['phone-details', phoneId],
    () => apiFetcher.get(`/api/brandnew/models/${phoneId}/`)
  );

  const phone = phoneData?.data;
  const [quantity] = useState(1);
  
  // Fetch reviews
  const { data: reviewsData, isLoading: reviewsLoading, refetch: refetchReviews } = useApiGet(
    ['phone-reviews', phoneId],
    () => apiFetcher.get(`/api/brandnew/review/`),
    { enabled: !!phoneId }
  );
  
  // Filter reviews by phone_model
  const reviews = useMemo(() => {
    const allReviews = reviewsData?.data || reviewsData?.results || [];
    return allReviews.filter(review => 
      String(review.phone_model) === String(phoneId) || 
      String(review.phone_model_id) === String(phoneId)
    );
  }, [reviewsData, phoneId]);

  // Helper function to get the correct image source
  const getImageSrc = (imageSrc, fallback = '/SAMSUNG_GalaxyS23Ultra.png') => {
    if (!imageSrc) return fallback;
    
    // If it's a remote URL and starts with http, use it directly
    if (imageSrc.startsWith('http')) {
      return imageSrc;
    }
    
    // If it's a local path, ensure it starts with /
    return imageSrc.startsWith('/') ? imageSrc : `/${imageSrc}`;
  };

  // Update the state to include pricing
  const [selectedOptions, setSelectedOptions] = useState({
    storage: "256GB",
    color: "Black",
    condition: "Perfect condition",
    pricing: {
      price: "€239.90",
      installment: "or €23.99 x 10"
    }
  });

  // Ensure initial selected color is first available color (must be before any early returns)
  useEffect(() => {
    if (phone?.colors?.length && !selectedOptions.color) {
      setSelectedOptions(prev => ({ ...prev, color: phone.colors[0].name }));
    }
  }, [phone?.colors, selectedOptions.color]);

  // Save phone data to sessionStorage
  useEffect(() => {
    if (!phone || !phoneId) return;
    try {
      const selectedColorObj = phone?.colors?.find(c => 
        c.name === selectedOptions.color
      ) || (selectedOptions.color ? { name: selectedOptions.color } : null);
      
      const payload = {
        ...phone,
        id: parseInt(phoneId),
        quantity,
        selectedColor: selectedColorObj,
        color: selectedOptions.color
      };
      sessionStorage.setItem('selectedPhone', JSON.stringify(payload));
    } catch (e) {
      console.error('Error saving phone to sessionStorage:', e);
    }
  }, [phone, phoneId, quantity, selectedOptions.color]);

  // Handler for option selection
  const handleOptionSelect = (category, option) => {
    setSelectedOptions(prev => {
      const newState = {
        ...prev,
        [category]: typeof option === 'object' ? option.name : option
      };

      // Update pricing when condition changes
      if (category === 'condition') {
        const selectedCondition = motorolaEdge50FusionData.selections.condition.options.find(
          opt => opt.name === option.name
        );
        if (selectedCondition) {
          newState.pricing = selectedCondition.pricing;
        }
      }

      return newState;
    });
  };

  const handleProceedToCheckout = () => {
    router.push(`/phones/${brand}/${phoneId}/breakdown`);
  };

  // Show loading state
  if (phoneLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen relative overflow-hidden bg-primary">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="relative flex justify-center items-center">
                <Skeleton className="h-[350px] w-[300px] bg-white/10" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-8 w-64 bg-white/10" />
                <div className="flex gap-4">
                  <Skeleton className="h-6 w-32 bg-white/10" />
                  <Skeleton className="h-6 w-40 bg-white/10" />
                </div>
                <Skeleton className="h-32 w-full bg-white/10" />
                <Skeleton className="h-32 w-full bg-white/10" />
                <Skeleton className="h-32 w-full bg-white/10" />
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  // Show error state
  if (phoneError || !phone) {
    return (
      <PageTransition>
        <div className="min-h-screen relative overflow-hidden bg-primary">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-accent">Phone Not Found</h2>
                <p className="text-accent/80">Sorry, we couldn't find the phone you're looking for.</p>
                <Link href={`/phones/${brand}`} className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80">
                  <ArrowLeft className="w-4 h-4" />
                  Back to {brand.charAt(0).toUpperCase() + brand.slice(1)} Phones
                </Link>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  // Mock data for features and sections (you can replace with API data later)
  const features = [
    {
      icon: "Check",
      text: "Guarantee",
      value: "2 years"
    },
    {
      icon: "Pay10",
      text: "Payment in",
      value: "10 times interest-free"
    }
  ];

  const availability = {
    title: `Your ${phone.name} is available at`,
    store: {
      icon: "saveIcon",
      name: "Save Paris République",
      location: {
        icon: "locationIcon",
        address: "15 Place de la République 75011 Paris"
      },
      reservation: {
        icon: "calendarIcon",
        text: "Reserve my refurbished"
      }
    }
  };

  const refurbishmentProcess = {
    title: `At Save, every ${phone.name} goes through a meticulous process to ensure optimal quality and performance.`,
    steps: [
      {
        number: 1,
        title: "Initial Inspection",
        description: `Every ${phone.name} undergoes a thorough inspection. Our qualified technicians assess the overall condition of the phone, including checking the screen, chassis, battery, internal components, and features.`
      },
      {
        number: 2,
        title: "Diagnosis and Testing",
        description: `After the initial inspection, the ${phone.name} undergoes a comprehensive diagnosis. We use specialized tools to evaluate the phone's performance, testing all its features, including the camera, touch, network connectivity, and sensors.`
      },
      {
        number: 3,
        title: "Repair and Replacement of Parts",
        description: "Once the problems are identified, our team of experienced technicians will carry out the necessary repairs. Defective parts will be replaced with original parts or parts of equivalent quality."
      },
      {
        number: 4,
        title: "Grade Definition",
        description: `When its repair is complete, our expert technicians define the grade of the refurbished ${phone.name} according to the following criteria:`,
        criteria: [
          "Grade A: The product is in excellent condition and its performance is equivalent to a new product.",
          "Grade B: The product is in good condition, but may show some barely visible micro-scratches.",
          "Grade C: the product is perfectly functional but shows more visible signs of wear such as scratches or micro-impacts."
        ]
      },
      {
        number: 5,
        title: "Deep Cleaning",
        description: `After repairs, the ${phone.name} undergoes a deep cleaning process. All traces of dirt, dust, and residue are removed, ensuring a flawless aesthetic appearance.`
      },
      {
        number: 6,
        title: "Final Test and Certification",
        description: `Before being put on sale, each refurbished ${phone.name} undergoes a final quality test. We ensure that all the phone's features work perfectly and that its performance meets SAVE's high standards.`
      }
    ]
  };

  // Determine if description has actual content (not just empty tags)
  const hasDescription = Boolean(
    phone?.description &&
    phone.description.replace(/<[^>]*>/g, '').trim().length > 0
  );

  return (
    <PageTransition>
      <div className="min-h-screen relative overflow-hidden bg-primary">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <MotionFade delay={0.1} immediate={true}>
            <Link href={`/phones/${brand}`} className="inline-flex items-center gap-2 text-accent hover:text-secondary transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to {phone.brand_name} Phones
            </Link>
          </MotionFade>

          {/* Details Section */}
          <MotionFade delay={0.2} immediate={true}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-4 items-start">
              {/* Left: Image */}
            <div>
            <div className="relative flex justify-center items-start lg:sticky lg:top-24">
                <SafeImage
                  src={getImageSrc(phone?.icon)}
                  alt={phone?.name || 'Phone'}
                  width={480}
                  height={480}
                  className="w-full max-w-md h-auto object-contain rounded-xl p-4"
                />
              </div>
              <div className='flex flex-col gap-4 pt-12'>
                 {/* Pricing */}
                 <div className="">
                  <div className="text-3xl font-bold text-secondary">
                    ${parseFloat(phone.final_price).toLocaleString()}
                  </div>
                  {phone.discounted_amount && phone.discounted_amount !== phone.main_amount && (
                    <div className="text-accent/60 line-through text-lg">
                      ${parseFloat(phone.main_amount).toLocaleString()}
                    </div>
                  )}
                  {phone.discount_percentage && parseFloat(phone.discount_percentage) > 0 && (
                    <div className="text-secondary text-sm">
                      {parseFloat(phone.discount_percentage).toFixed(1)}% off
                    </div>
                  )}
                </div>

                {/* Availability */}
                <div className="border-t border-accent/20 pt-6">
                  <h3 className="font-semibold mb-4 text-accent">{availability.title}</h3>
                  <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-accent/20">
                    <div className="flex-1">
                      <div className="font-medium flex items-center gap-2 text-accent">
                        <Save className="w-5 h-5 text-secondary" />
                        {availability.store.name}
                      </div>
                      <div className="text-accent/80 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-accent/60" />
                        {availability.store.location.address}
                      </div>
                    </div>
                    <button 
                      onClick={handleProceedToCheckout}
                      className="bg-secondary text-primary px-6 py-2 rounded-full flex items-center gap-2 hover:bg-secondary/90 transition-colors cursor-pointer"
                    >
                      <Calendar className="w-5 h-5" />
                      Buy Now
                    </button>
                  </div>
                </div>
          </div>
            </div>

              {/* Right: Content */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-secondary tracking-tight">{phone.name}</h1>
                  <p className="text-accent/80 text-base md:text-lg mt-1">{phone.brand_name}</p>
                </div>

                {/* Storage (fixed) and Colors (selectable) */}
                <div className="space-y-5">
                  {/* Storage */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-accent">RAM</h3>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 rounded-full border bg-secondary text-primary border-secondary cursor-not-allowed">
                        {phone?.ram}GB
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-accent">Storage capacity</h3>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 rounded-full border bg-secondary text-primary border-secondary cursor-not-allowed">
                        {phone?.memory}GB
                      </span>
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-accent">Choose the color</h3>
                    <div className="flex flex-wrap gap-2">
                      {(phone.colors || []).map((color) => {
                        const isSelected = (selectedOptions.color || phone.colors?.[0]?.name) === color.name;
                        return (
                          <button
                            key={color.name}
                            onClick={() => setSelectedOptions(prev => ({ ...prev, color: color.name }))}
                            className={`px-3 py-2 rounded-full border transition-all duration-200 flex items-center gap-2 ${
                              isSelected
                                ? 'bg-secondary text-primary border-secondary hover:shadow-md'
                                : 'border-accent/30 text-accent hover:shadow-md'
                            }`}
                          >
                            <span
                              className="inline-block w-4 h-4 rounded-full border"
                              style={{ backgroundColor: color.hex_code || '#ccc' }}
                            />
                            <span>{color.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                {/* Phone Specifications */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-accent/20">
                  <h3 className="text-lg font-semibold text-secondary mb-4">Specifications</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-1">
                    <div>
                      <span className="text-accent/80">Storage:</span>
                      <span className="text-accent ml-2">{phone.memory}GB</span>
                    </div>
                    <div>
                      <span className="text-accent/80">RAM:</span>
                      <span className="text-accent ml-2">{phone.ram}GB</span>
                    </div>
                    <div>
                      <span className="text-accent/80">Stock:</span>
                      <span className="text-accent ml-2">{phone.stock_quantity} units</span>
                    </div>
                    <div>
                      <span className="text-accent/80">Status:</span>
                      <span className={`ml-2 ${phone.is_in_stock ? 'text-green-400' : 'text-red-400'}`}>
                        {phone.is_in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {hasDescription && (
                  <div className="bg-white/10 rounded-xl border border-accent/20 p-6">
                    <h3 className="text-lg font-semibold text-secondary mb-3">Description</h3>
                    <div className="prose  prose-sm max-w-none text-secondary" dangerouslySetInnerHTML={{ __html: phone.description }} />
                  </div>
                )}
              </div>
            </div>
          </MotionFade>

          {/* Refurbishment Process */}
          <MotionFade delay={0.3} immediate={true}>
            <section className="my-16">
              <h2 className="text-2xl font-bold mb-8 text-secondary">{refurbishmentProcess.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {refurbishmentProcess.steps.map((step) => (
                  <div key={step.number} className="bg-white/10 backdrop-blur-sm border border-accent/20 rounded-lg p-6">
                    <div className="text-2xl font-bold text-secondary mb-4">
                      Step {step.number}
                    </div>
                    <h3 className="font-semibold mb-2 text-accent">{step.title}</h3>
                    <p className="text-accent/80">{step.description}</p>
                    {step.criteria && (
                      <ul className="mt-4 space-y-2">
                        {step.criteria.map((criterion, index) => (
                          <li key={index} className="text-sm text-accent/80">
                            • {criterion}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </MotionFade>

          {/* Reviews Section */}
          <ReviewsSection
            productId={phoneId}
            type="phone"
            reviews={reviews}
            isLoading={reviewsLoading}
            refetchReviews={refetchReviews}
            showReviewForm={false}
          />
        </div>
      </div>
    </PageTransition>
  );
}