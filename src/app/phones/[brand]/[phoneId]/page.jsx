'use client';
import React, { use, useState } from 'react';
import {
  CheckCircle,
  CreditCard,
  ShoppingBag,
  MapPin,
  Calendar,
  Save,
  Shield
} from 'lucide-react';

export default function PhoneIndividualPage({ params }) {
  const model = decodeURIComponent(use(params).phoneId.toString());

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

  const motorolaEdge50FusionData = {
    product: {
      name: "MOTOROLA EDGE 50 FUSION",
      badge: "SavePicto",
      type: "Refurbished",
      vendor: "at Save",
      images: "/motorola-edge-50-fusion.jpg"
    },
    features: [
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
    ],
    selections: {
      storage: {
        title: "Choose storage capacity",
        options: ["128GB", "256GB"],
        selected: "256GB"
      },
      color: {
        title: "Choose the color",
        options: ["Black", "Blue", "Green"],
        selected: "Black"
      },
      condition: {
        title: "Choose the state",
        options: [
          {
            name: "Perfect condition",
            pricing: {
              price: "€239.90",
              installment: "or €23.99 x 10",
              icon: "shopIcon"
            }
          },
          {
            name: "Excellent condition",
            pricing: {
              price: "€219.90",
              installment: "or €21.99 x 10",
              icon: "shopIcon"
            }
          },
          {
            name: "Good condition",
            pricing: {
              price: "€199.90",
              installment: "or €19.99 x 10",
              icon: "shopIcon"
            }
          }
        ],
        selected: "Perfect condition"
      }
    },
    availability: {
      title: "Your MOTOROLA EDGE 50 FUSION is available at",
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
    },
    refurbishmentProcess: {
      title: "At Save, every MOTOROLA EDGE 50 FUSION goes through a meticulous process to ensure optimal quality and performance.",
      steps: [
        {
          number: 1,
          title: "Initial Inspection",
          description: "Every MOTOROLA EDGE 50 FUSION undergoes a thorough inspection. Our qualified technicians assess the overall condition of the phone, including checking the screen, chassis, battery, internal components, and features."
        },
        {
          number: 2,
          title: "Diagnosis and Testing",
          description: "After the initial inspection, the MOTOROLA EDGE 50 FUSION undergoes a comprehensive diagnosis. We use specialized tools to evaluate the phone's performance, testing all its features, including the camera, touch, network connectivity, and sensors."
        },
        {
          number: 3,
          title: "Repair and Replacement of Parts",
          description: "Once the problems are identified, our team of experienced technicians will carry out the necessary repairs. Defective parts will be replaced with original parts or parts of equivalent quality."
        },
        {
          number: 4,
          title: "Grade Definition",
          description: "When its repair is complete, our expert technicians define the grade of the refurbished MOTOROLA EDGE 50 FUSION according to the following criteria:",
          criteria: [
            "Grade A: The product is in excellent condition and its performance is equivalent to a new product.",
            "Grade B: The product is in good condition, but may show some barely visible micro-scratches.",
            "Grade C: the product is perfectly functional but shows more visible signs of wear such as scratches or micro-impacts."
          ]
        },
        {
          number: 5,
          title: "Deep Cleaning",
          description: "After repairs, the MOTOROLA EDGE 50 FUSION undergoes a deep cleaning process. All traces of dirt, dust, and residue are removed, ensuring a flawless aesthetic appearance."
        },
        {
          number: 6,
          title: "Final Test and Certification",
          description: "Before being put on sale, each refurbished MOTOROLA EDGE 50 FUSION undergoes a final quality test. We ensure that all the phone's features work perfectly and that its performance meets SAVE's high standards."
        }
      ]
    },
    relatedProducts: [
      {
        name: "MOTOROLA EDGE 40",
        fullName: "Motorola Edge 40",
        price: "from €199",
        stores: ["Shop", "Location", "Orange", "Save Paris République"],
        warranty: {
          icon: "WarrantyIcon",
          text: "2-year warranty"
        }
      }
    ],
    testimonials: {
      title: "Our customers' SAVE experience",
      reviews: [
        {
          quote: "I'm impressed with the quality of my refurbished Motorola Edge 50 Fusion. It looks and works like new, and the price was unbeatable. The staff at Save were very helpful with the setup!",
          author: "Thomas",
          product: "Refurbished Motorola Edge 50 Fusion"
        },
        {
          quote: "Great experience buying from Save. My Motorola phone arrived in perfect condition, and the 2-year warranty gives me complete peace of mind. Will definitely recommend to friends!",
          author: "Sophie L.",
          product: "Refurbished Motorola Edge 50 Fusion"
        },
        {
          quote: "Fast service and excellent quality. My refurbished Motorola works flawlessly, and the battery life is amazing. Much better value than buying new!",
          author: "Marc D.",
          product: "Refurbished Motorola Edge 50 Fusion"
        }
      ]
    }
  };

  const { product, features, selections, availability, refurbishmentProcess, relatedProducts, testimonials } = motorolaEdge50FusionData;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="relative flex justify-center items-center">
          <img
            src={product.images}
            alt={product.name}
            className="h-[350px] w-auto object-contain shadow-lg"
          />
          <span className="absolute bottom-9 md:bottom-56 right-10 md:right-28 bg-primary text-white px-3 py-1 rounded-full text-sm">
            {product.type}
          </span>
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          {/* Features */}
          <div className="flex gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                {feature.text === "Guarantee" ? (
                  <Shield className="w-5 h-5 text-primary" />
                ) : (
                  <CreditCard className="w-5 h-5 text-primary" />
                )}
                <span>{feature.text}: {feature.value}</span>
              </div>
            ))}
          </div>

          {/* Selections */}
          {Object.entries(selections).map(([key, selection]) => (
            key !== 'condition' && (  // Only render non-condition selections here
              <div key={key} className="space-y-2">
                <h3 className="font-semibold">{selection.title}</h3>
                <div className="flex gap-2">
                  {selection.options.map((option) => (
                    <button
                      key={typeof option === 'string' ? option : option.name}
                      onClick={() => handleOptionSelect(key, option)}
                      className={`px-4 py-2 rounded-full border transition-all duration-200 hover:border-blue-400 ${
                        option === selectedOptions[key]
                          ? 'bg-primary text-white border-primary hover:shadow-md'
                          : 'border-gray-300 hover:shadow-md'
                      }`}
                    >
                      {typeof option === 'string' ? option : option.name}
                    </button>
                  ))}
                </div>
              </div>
            )
          ))}

          {/* Condition Selection - Updated */}
          {selections.condition && (
            <div className="space-y-2">
              <h3 className="font-semibold">{selections.condition.title}</h3>
              <div className="flex flex-col gap-2">
                {selections.condition.options.map((option) => (
                  <button
                    key={option.name}
                    onClick={() => handleOptionSelect('condition', option)}
                    className={`px-4 py-2 rounded-lg border transition-all duration-200 hover:border-blue-400 ${
                      option.name === selectedOptions.condition
                        ? 'bg-primary text-white border-primary hover:shadow-md'
                        : 'border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{option.name}</span>
                      <span>{option.pricing.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pricing - Updated */}
          <div className="border-t pt-6">
            <div className="text-3xl font-bold">{selectedOptions.pricing.price}</div>
            <div className="text-gray-600">{selectedOptions.pricing.installment}</div>
          </div>

          {/* Availability */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">{availability.title}</h3>
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
              <div className="flex-1">
                <div className="font-medium flex items-center gap-2">
                  <Save className="w-5 h-5 text-primary" />
                  {availability.store.name}
                </div>
                <div className="text-gray-600 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  {availability.store.location.address}
                </div>
              </div>
              <button className="bg-primary text-white px-6 py-2 rounded-full flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Refurbishment Process */}
      <section className="my-16">
        <h2 className="text-2xl font-bold mb-8">{refurbishmentProcess.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {refurbishmentProcess.steps.map((step) => (
            <div key={step.number} className="border rounded-lg p-6">
              <div className="text-2xl font-bold text-primary mb-4">
                Step {step.number}
              </div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              {step.criteria && (
                <ul className="mt-4 space-y-2">
                  {step.criteria.map((criterion, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      • {criterion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="my-16 bg-gray-50 py-12 px-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-8 text-center">{testimonials.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.reviews.map((review, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow">
              <p className="italic mb-4">"{review.quote}"</p>
              <div className="text-sm">
                <strong>{review.author}</strong>
                <p className="text-gray-600">{review.product}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Related Products */}
      <section className="my-16">
        <h2 className="text-2xl font-bold mb-8">Related Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {relatedProducts.map((item, index) => (
            <div key={index} className="border rounded-lg p-3 md:p-4 hover:shadow-lg transition-shadow duration-200">
              <div className="relative aspect-square mb-3 md:mb-4">
                <img
                  src={product.images}
                  alt={item.fullName}
                  className="object-contain w-full h-full max-h-[180px] rounded-lg"
                />
              </div>
              <h3 className="font-semibold text-sm md:text-base">{item.fullName}</h3>
              <p className="text-primary font-bold text-sm md:text-base">{item.price}</p>
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 mt-2">
                <Shield className="w-4 h-4" />
                <span>{item.warranty.text}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
