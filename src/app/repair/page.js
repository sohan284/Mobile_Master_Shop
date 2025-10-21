"use client"
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PageTransition from "@/components/animations/PageTransition";
import { useApiGet } from "@/hooks/useApi";
import { apiFetcher } from "@/lib/api";

export default function RepairPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch brands from API using direct useApiGet
  const { data: brandsResponse, isLoading, error } = useApiGet(
    ['brands'],
    () => apiFetcher.get('/brands/')
  );
  
  // Fallback brands if API fails
  const fallbackBrands = [
    {
      id: 1,
      name: "Apple",
      logo: "/Apple.png",
      route: "/repair/apple",
    },
    {
      id: 2,
      name: "Samsung",
      logo: "/Samsung.png",
      route: "/repair/samsung",
    },
    {
      id: 3,
      name: "Huawei",
      logo: "/Huawei.png",
      route: "/repair/huawei",
    },
    {
      id: 4,
      name: "Xiaomi",
      logo: "/Xiaomi.png",
      route: "/repair/xiaomi",
    },
    {
      id: 5,
      name: "Oppo",
      logo: "/Oppo.png",
      route: "/repair/oppo",
    },
    {
      id: 6,
      name: "Honor",
      logo: "/Honor.png",
      route: "/repair/honor",
    },
  ];
  
  // Use API data or fallback
  const phoneBrands = brandsResponse?.data || fallbackBrands;
  
  // Filter brands based on search term
  const filteredBrands = phoneBrands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log(filteredBrands);
  return (
  <PageTransition>
      <div className="min-h-screen max-w-[1200px] mx-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="">
       <div className="mb-12 bg-white p-8 rounded shadow-xl border border-gray-100 relative overflow-hidden">
        <div className="bg-primary text-white w-30 h-30 absolute -top-10 pl-14 pt-8 -left-10 font-serif rounded-full text-7xl font-extrabold shadow-md">
            1
        </div>
       <h1 className="title text-primary mb-8 text-center">
            Choose the brand of your phone
          </h1>
          <p className="subtitle text-center mb-8">
            Select your phone brand to get started with professional repair services
          </p>
      {/* Search Bar */}
      <div className="mb-6">
                            <div className="relative mx-auto">
                                <input
                                    type="text"
                                    placeholder={`Search brand..`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-3 pl-10 pr-4 text-gray-700 bg-transparent border-0 border-b-2 border-gray-300 rounded-none focus:outline-none focus:border-blue-500"
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    
          {/* Phone Brands Section */}
          <div className="mb-12"></div>
          
          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-600">Loading brands...</p>
            </div>
          )}
          
          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                Failed to load brands. Using fallback data.
              </div>
            </div>
          )}
          
          {/* Brands Grid */}
          {!isLoading && filteredBrands.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {filteredBrands.map((brand) => (
                <Link key={brand.id} href={brand.route || `/repair/${brand.name.toLowerCase()}`}>
                  <div className="bg-white h-30 w-30 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer text-center flex flex-col items-center justify-center">
                    <div className="flex justify-center mb-3">
                      <Image
                        src={brand.logo || `/Apple.png`}
                        alt={brand.name}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    </div>
                    <h3 className="subtitle text-center">
                      {brand.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          {/* No Results */}
          {!isLoading && filteredBrands.length === 0 && (
            <div className="text-center py-12">
              <div className="subtitle text-gray-500 mb-4">
                No brands found matching &quot;{searchTerm}&quot;
              </div>
              <button
                onClick={() => setSearchTerm('')}
                className="text-primary hover:text-blue-800 underline"
              >
                Clear search
              </button>
            </div>
          )}
          </div>

       </div>
          <div className="">
          <ul className="space-y-4">
              <li className="paragraph">
                <span className="subtitle block mb-2">SMARTPHONE REPAIR NEAR YOU WITH SAVE</span>
                For smartphone repairs in Nantes, Paris, Lyon, or Marseille, with Save, you can access one
                of our 150 stores located throughout France. Always closer to
                you, we repair your devices while respecting both industry and
                manufacturer requirements.
              </li>
              <li>
                With original components and exceptional support, Save is the <br />
                ideal partner for hassle-free phone repairs. And the best part
                is that we offer a wide range of services at unbeatable prices.
              </li>
              <li>
                This way, you won&apos;t have to waste your money on throwing <br />
                away your smartphone and buying another one. With our expert
                qualifications, you won&apos;t have any trouble getting your
                phone repaired.
              </li>
              <li>
                FAST SUPPORT TO GET YOUR SMILE BACK <br /> At Save, we pride ourselves
                on satisfying our customers by offering the best services in the
                shortest possible time. In fact, weve made a commitment to
                repair your phone in just 40 minutes. We meet this requirement
                82% of the time.
              </li>
              <li>
                However, for more complex breakdowns, immobilizing your <br />
                smartphone will be necessary. In this case, we will not hesitate
                to lend you a phone while the repair is carried out (subject to
                available stock). This way, you will be able to receive your
                calls and messages without the risk of missing an important
                communication.
              </li>
              <li>
                When you visit one of our 150 stores, you&apos;ll enjoy a warm <br />
                welcome and personalized service. With their attentive listening
                skills, our teams of expert technicians will perform a
                comprehensive diagnostic of your problems.
              </li>
              <li>
                This approach will allow you to benefit from a personalized <br />
                quote. This way, you&apos;ll know the exact amount to pay, which
                will avoid any unpleasant surprises. In complete transparency,
                your technician will explain the breakdown to you and outline
                the solution best suited to your needs.
              </li>
              <li>
                MILLIMETER PRICING IN COMPLETE TRANSPARENCY <br /> Getting your phone
                repaired can sometimes be very expensive. Especially when
                it&apos;s out of warranty and you have to take it back to your
                after-sales service. To save money with peace of mind, Point
                Service Mobiles offers transparent quotes at competitive prices.
              </li>
              <li>
                Depending on the brand (Samsung, Honor, Sony, Apple, etc.) and <br />
                model (Galaxy Note 9, iPhone XR, Huawei P20, Xperia Z5, etc.) of
                your smartphone, we offer you a precise quote. To make your life
                easier, our services include both the cost of labor and the
                price of the replacement part.
              </li>
              <li>
                With Save, we&apos;ve done everything we can to ensure you <br />
                don&apos;t spend more than you need to. Always with the goal of
                saving you money, we frequently provide you with promo codes to
                take advantage of great discounts. So be vigilant so you
                don&apos;t miss out!
              </li>
              <li>
                EXCEPTIONAL EXPERTISE TO SERVE EACH OF YOUR NEEDS <br /> The quality of
                our services, the diligence of our repairs and the dynamism of
                our teams are among the main assets that have allowed Save to
                establish itself as the leader in smartphone repair in France.
                Every day, we take pleasure in putting smiles back on our
                customers&apos; faces by responding promptly to their needs
                while offering competitive pricing. Our technicians receive
                in-house training and upgrades to strengthen their operational
                capabilities. Such high standards allow us to always meet even
                the most complex needs of our valued customers. Whether
                it&apos;s iPhone XS screen repair, Samsung Galaxy S9+ battery
                replacement, or Huawei Mate 10 Pro rear camera replacement, Save
                will ensure you&apos;re satisfied in every way. 
                </li>
                <li>
                GENUINE SPARE
                PARTS TO GIVE YOUR PHONE A SECOND LIFE <br /> Faulty charging
                connector, broken volume keys, oxidized phone after falling into
                the pool, unresponsive microphone, etc., the breakdowns are as
                diverse as they are varied. Visiting one of your stores will
                allow you to easily resolve your problem. Unlike a traditional
                after-sales service where you have to spend a small fortune and
                then be subjected to a horribly long repair time, Save offers
                you a less expensive, but just as advantageous solution. In
                addition to our technicians&apos; remarkable expertise,
                you&apos;ll benefit from genuine parts for every repair. Our
                mission is to give your smartphone a new lease on life, which is
                why our replacement parts are the same as those used by
                manufacturers. Even better, all our repairs come with a one-year
                warranty! So, once it&apos;s been repaired, you won&apos;t have
                to worry about your smartphone breaking down again. With genuine
                parts, your smartphone will be just as good as a factory-fresh
                model. Whether you&apos;re looking for HTC, Samsung, Nokia,
                Wiko, or even Doro, our extensive catalog of spare parts will
                ensure you get a durable and reliable repair.
              </li>
            </ul>
          </div>
        </div>
      </div>
    
  </PageTransition>
  );
}
