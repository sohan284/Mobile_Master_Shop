'use client';
import React, { use, useState, useEffect } from 'react';
import {
  CheckCircle,
  CreditCard,
  ShoppingBag,
  MapPin,
  Calendar,
  Save,
  Shield,
  ArrowLeft,
  Star,
  Clock,
  Check
} from 'lucide-react';
import Link from 'next/link';
import { useApiGet } from '@/hooks/useApi';
import { apiFetcher } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import PageTransition from '@/components/animations/PageTransition';
import MotionFade from '@/components/animations/MotionFade';
import SafeImage from '@/components/ui/SafeImage';

export default function PhoneIndividualPage({ params }) {
  const phoneId = use(params).phoneId;
  const brand = use(params).brand;

  // Fetch phone data from API
  const { data: phoneData, isLoading: phoneLoading, error: phoneError } = useApiGet(
    ['phone-details', phoneId],
    () => apiFetcher.get(`/api/brandnew/models/${phoneId}/`)
  );

  const phone = phoneData?.data;

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

  const selections = {
    storage: {
      title: "Choose storage capacity",
      options: [phone.memory + "GB"],
      selected: phone.memory + "GB"
    },
    color: {
      title: "Choose the color",
      options: phone.colors?.map(color => color.name) || ["Black"],
      selected: phone.colors?.[0]?.name || "Black"
    }
  };

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

  const testimonials = {
    title: "Our customers' SAVE experience",
    reviews: [
      {
        quote: `I'm impressed with the quality of my refurbished ${phone.name}. It looks and works like new, and the price was unbeatable. The staff at Save were very helpful with the setup!`,
        author: "Thomas",
        product: `Refurbished ${phone.name}`
      },
      {
        quote: `Great experience buying from Save. My ${phone.brand_name} phone arrived in perfect condition, and the 2-year warranty gives me complete peace of mind. Will definitely recommend to friends!`,
        author: "Sophie L.",
        product: `Refurbished ${phone.name}`
      },
      {
        quote: `Fast service and excellent quality. My refurbished ${phone.name} works flawlessly, and the battery life is amazing. Much better value than buying new!`,
        author: "Marc D.",
        product: `Refurbished ${phone.name}`
      }
    ]
  };

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

          {/* Hero Section */}
          <MotionFade delay={0.2} immediate={true}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="relative flex justify-center items-center">
                <SafeImage
                  src={getImageSrc(phone?.icon)}
                  alt={phone?.name || 'Phone'}
                  width={400}
                  height={400}
                  className="h-[350px] w-auto object-contain shadow-lg"
                />
                <span className="absolute bottom-9 md:bottom-56 right-10 md:right-28 bg-secondary text-primary px-3 py-1 rounded-full text-sm font-medium">
                  Refurbished
                </span>
              </div>

              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-accent">{phone.name}</h1>
                <p className="text-accent/80 text-lg">{phone.brand_name}</p>

                {/* Features */}
                <div className="flex gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {feature.text === "Guarantee" ? (
                        <Shield className="w-5 h-5 text-secondary" />
                      ) : (
                        <CreditCard className="w-5 h-5 text-secondary" />
                      )}
                      <span className="text-accent">{feature.text}: {feature.value}</span>
                    </div>
                  ))}
                </div>
</div>
                {/* Phone Specifications */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-accent/20">
                  <h3 className="text-lg font-semibold text-secondary mb-4">Specifications</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
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

                {/* Selections */}
                {Object.entries(selections).map(([key, selection]) => (
                  <div key={key} className="space-y-2">
                    <h3 className="font-semibold text-accent">{selection.title}</h3>
                    <div className="flex gap-2">
                      {selection.options.map((option) => (
                        <button
                          key={typeof option === 'string' ? option : option.name}
                          onClick={() => handleOptionSelect(key, option)}
                          className={`px-4 py-2 rounded-full border transition-all duration-200 hover:border-secondary/50 ${
                            option === selectedOptions[key]
                              ? 'bg-secondary text-primary border-secondary hover:shadow-md'
                              : 'border-accent/30 text-accent hover:shadow-md'
                          }`}
                        >
                          {typeof option === 'string' ? option : option.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Pricing */}
                <div className="border-t border-accent/20 pt-6">
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
                    <button className="bg-secondary text-primary px-6 py-2 rounded-full flex items-center gap-2 hover:bg-secondary/90 transition-colors">
                      <Calendar className="w-5 h-5" />
                      Buy Now
                    </button>
                  </div>
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

          {/* Testimonials */}
          <MotionFade delay={0.4} immediate={true}>
            <section className="my-16 bg-white/10 backdrop-blur-sm py-12 px-6 rounded-xl border border-accent/20">
              <h2 className="text-2xl font-bold mb-8 text-center text-secondary">{testimonials.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.reviews.map((review, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow border border-accent/20">
                    <p className="italic mb-4 text-accent">"{review.quote}"</p>
                    <div className="text-sm">
                      <strong className="text-accent">{review.author}</strong>
                      <p className="text-accent/80">{review.product}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </MotionFade>

          {/* Related Products */}
          {/* <MotionFade delay={0.5} immediate={true}>
            <section className="my-16">
              <h2 className="text-2xl font-bold mb-8 text-secondary">Related Products</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((item, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm border border-accent/20 rounded-lg p-3 md:p-4 hover:shadow-lg transition-shadow duration-200">
                    <div className="relative aspect-square mb-3 md:mb-4">
                      <SafeImage
                        src={getImageSrc(phone?.icon)}
                        alt={item.fullName || 'Related Product'}
                        width={180}
                        height={180}
                        className="object-contain w-full h-full max-h-[180px] rounded-lg"
                      />
                    </div>
                    <h3 className="font-semibold text-sm md:text-base text-accent">{item.fullName}</h3>
                    <p className="text-secondary font-bold text-sm md:text-base">{item.price}</p>
                    <div className="flex items-center gap-2 text-xs md:text-sm text-accent/80 mt-2">
                      <Shield className="w-4 h-4" />
                      <span>{item.warranty.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </MotionFade> */}
        </div>
      </div>
    </PageTransition>
  

  )
}
