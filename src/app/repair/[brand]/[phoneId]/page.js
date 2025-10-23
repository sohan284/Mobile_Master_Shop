'use client';   
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PageTransition from '@/components/animations/PageTransition';
import { CustomButton } from '@/components/ui/button';
import { apiFetcher } from '@/lib/api';
import { useApiGet } from '@/hooks/useApi';
import { Skeleton } from '@/components/ui/skeleton';
import NotFound from '@/components/ui/NotFound';

export default function PhoneModelPage({ params }) {
    const { brand, phoneId } = params;
    const [selectedServices, setSelectedServices] = useState([]);
      // Fetch services for this model
  const { data: servicesResponse, isLoading: servicesLoading, error: servicesError, refetch: refetchServices } = useApiGet(
    ['services', phoneId],
    () => apiFetcher.get(`/api/repair/repair-prices/?phone_model=${phoneId}`)
  );
  const repairServices = servicesResponse?.data || [];
 




    const handleServiceSelect = (serviceId) => {
        setSelectedServices(prev => {
            if (prev.includes(serviceId)) {
                // If already selected, remove it
                return prev.filter(id => id !== serviceId);
            } else {
                // If not selected and we have less than 3, add it
                if (prev.length < 3) {
                    return [...prev, serviceId];
                }
                // If already 3 selected, don't add more
                return prev;
            }
        });
    };

    return (
        <PageTransition>
        <div className="min-h-screen ">
          <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Breadcrumb */}
                    <div className="mb-6">
                        <Link href="/repair" className="text-primary hover:text-blue-800">
                            ← Back to Repair Services
                        </Link>
                        <span className="mx-2 text-gray-400">/</span>
                        <Link href={`/repair/${brand}`} className="text-primary hover:text-blue-800">
                            {brand.charAt(0).toUpperCase() + brand.slice(1)} Repair
                        </Link>
                    </div>

              
                    
                    {/* Step System */}
                    <div className="mb-12 bg-white min-h-[500px] p-8 rounded shadow-xl border border-gray-100 relative overflow-hidden">
                        <div className="bg-primary text-white w-30 h-30 absolute -top-10 pl-14 pt-8 -left-10 font-serif rounded-full text-7xl font-extrabold shadow-md">
                            3
                        </div>
                        <h2 className="title text-primary mb-8 text-center">
                            Choose your repair service
                        </h2>
                        
                        {/* Loading State - Skeleton Loader */}
                        {servicesLoading && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <div key={index} className="p-3 pb-1 rounded-xl shadow border-2 border-gray-100 bg-white">
                                        <div className="flex items-center mb-4">
                                            <Skeleton className="w-6 h-6 mr-3" />
                                            <Skeleton className="flex-1 h-6" />
                                            <Skeleton className="w-6 h-6 ml-auto" />
                                        </div>
                                        <div className="space-y-2">
                                            <Skeleton className="w-full h-4" />
                                            <Skeleton className="w-3/4 h-4" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Empty State - No Services Available */}
                        {!servicesLoading && repairServices.length === 0 && (
                            <NotFound
                                title="No Services Available"
                                description="We don't have any repair services available for this phone model at the moment. Please check back later or contact us for assistance."
                                primaryAction={
                                    <Link 
                                        href={`/repair/${brand}`} 
                                        className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                                    >
                                        Choose Different Model
                                    </Link>
                                }
                                secondaryAction={
                                    <span>
                                        or <Link href="/repair" className="text-primary hover:underline">browse all brands</Link>
                                    </span>
                                }
                            />
                        )}

                        {/* Services Grid */}
                        {!servicesLoading && repairServices.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {repairServices.map((service) => {
                                    const isSelected = selectedServices.includes(service.problem_id);
                                    const isDisabled = !isSelected && selectedServices.length >= 3;
                                    return (
                                        <div 
                                            key={service.problem_id} 
                                            onClick={() => handleServiceSelect(service.problem_id)}
                                            className={` p-3 pb-1 rounded-xl shadow transition-all duration-300 border-2 cursor-pointer ${
                                                isSelected 
                                                    ? ' border-primary shadow-primary' 
                                                    : isDisabled
                                                    ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-60'
                                                    : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-xl'
                                            }`}
                                        >
                                            <div className="flex items-center mb-4">
                                                <div className="text-xl mr-3">{service.icon}</div>
                                                <h3 className={`subtitle ${
                                                    isSelected ? 'text-primary' : 'text-gray-800'
                                                }`}>
                                                    {service.problem_name}
                                                </h3>   
                                                {isSelected && (
                                                    <div className="ml-auto">
                                                        <div className="w-6 h-6  bg-primary rounded-full flex items-center justify-center">
                                                            <span className="text-white text-sm">✓</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <p className={`mb-4 paragraph ${
                                                isSelected ? 'text-primary' : isDisabled ? 'text-gray-400' : 'text-gray-600'
                                            }`}>
                                                {service.problem_description}
                                            </p>
                                          
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Warning Message */}
                        {!servicesLoading && repairServices.length > 0 && selectedServices.length >= 3 && (
                            <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <span className="text-yellow-400 text-xl">⚠️</span>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-yellow-700">
                                            <strong>Maximum limit reached:</strong> You can select up to 3 services. 
                                            Deselect a service to choose a different one.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Continue Button */}
                        {!servicesLoading && repairServices.length > 0 && selectedServices.length > 0 && (
                            <div className="text-center mb-8">
                                <CustomButton className='bg-primary text-secondary hover:bg-primary/90'>
                                Continue with {selectedServices.length} selected service{selectedServices.length > 1 ? 's' : ''}
                                </CustomButton>
                            </div>
                        )}
                    </div>
                    
               
                  
                </div>
            </div>
         </div>
        </PageTransition>
    );
}


