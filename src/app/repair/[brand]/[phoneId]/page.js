import React from 'react';
import { getRepairServicesByModelServer, getRepairModelByIdServer, getRepairModelsByBrandServer } from '@/lib/api-server';
import { getTranslations } from 'next-intl/server';
import RepairModelClient from './RepairModelClient';

// SEO Metadata
export async function generateMetadata({ params }) {
  const { brand, phoneId } = await params;
  let phoneModel = null;
  let services = [];
  
  try {
    const [modelResponse, servicesResponse] = await Promise.all([
      getRepairModelByIdServer(phoneId),
      getRepairServicesByModelServer(phoneId)
    ]);
    
    // Handle model response - could be direct object or wrapped in data
    if (modelResponse && typeof modelResponse === 'object') {
      if (modelResponse.data && typeof modelResponse.data === 'object' && !Array.isArray(modelResponse.data)) {
        phoneModel = modelResponse.data;
      } else if (!modelResponse.data) {
        phoneModel = modelResponse;
      } else {
        phoneModel = modelResponse;
      }
    }
    
    // Handle services response
    if (Array.isArray(servicesResponse)) {
      services = servicesResponse;
    } else if (servicesResponse?.data && Array.isArray(servicesResponse.data)) {
      services = servicesResponse.data;
    } else if (servicesResponse?.results && Array.isArray(servicesResponse.results)) {
      services = servicesResponse.results;
    } else {
      services = [];
    }
  } catch (error) {
    // Error handled silently for metadata generation
  }
  
  const brandName = brand.charAt(0).toUpperCase() + brand.slice(1);
  const phoneName = phoneModel?.name || `${brandName} Phone`;
  const title = `${phoneName} Repair Services`;
  const description = `Professional ${phoneName} repair services. Choose from ${services.length} repair options. Expert technicians, quality parts, fast service.`;
  
  return {
    title,
    description,
    keywords: `${phoneName} repair, ${brandName} phone repair, ${phoneName} repair services, mobile repair ${brandName}, smartphone repair`,
    openGraph: {
      title,
      description,
      type: 'website',
      images: phoneModel?.image || phoneModel?.phone_image ? [phoneModel.image || phoneModel.phone_image] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: phoneModel?.image || phoneModel?.phone_image ? [phoneModel.image || phoneModel.phone_image] : [],
    },
  };
}

export default async function PhoneModelPage({ params }) {
  const { brand, phoneId } = await params;
  
  let services = [];
  let phoneModel = null;
  let brandModels = [];
  let error = null;

  try {
    const [servicesResponse, modelResponse, brandModelsResponse] = await Promise.all([
      getRepairServicesByModelServer(phoneId),
      getRepairModelByIdServer(phoneId),
      getRepairModelsByBrandServer(brand)
    ]);
    
    // Handle services response - could be array, {data: []}, or {results: []}
    if (Array.isArray(servicesResponse)) {
      services = servicesResponse;
    } else if (servicesResponse?.data && Array.isArray(servicesResponse.data)) {
      services = servicesResponse.data;
    } else if (servicesResponse?.results && Array.isArray(servicesResponse.results)) {
      services = servicesResponse.results;
            } else {
      services = [];
    }
    
    // Handle model response - could be direct object or wrapped in data
    // Dashboard code shows: const model = modelResponse; (direct object)
    if (modelResponse && typeof modelResponse === 'object') {
      // If it has a 'data' property and it's an object (not array), use it
      if (modelResponse.data && typeof modelResponse.data === 'object' && !Array.isArray(modelResponse.data)) {
        phoneModel = modelResponse.data;
     } else if (!modelResponse.data) {
        // Direct object (no data wrapper)
        phoneModel = modelResponse;
     } else {
        phoneModel = modelResponse;
     }
    }
    
    // Handle brand models response - could be array, {data: []}, or {results: []}
    if (Array.isArray(brandModelsResponse)) {
      brandModels = brandModelsResponse;
    } else if (brandModelsResponse?.data && Array.isArray(brandModelsResponse.data)) {
      brandModels = brandModelsResponse.data;
    } else if (brandModelsResponse?.results && Array.isArray(brandModelsResponse.results)) {
      brandModels = brandModelsResponse.results;
    } else {
      brandModels = [];
    }
  } catch (err) {
    error = err;
  }

    return (
    <RepairModelClient 
      initialServices={services}
      initialPhoneInfo={phoneModel}
      initialBrandModels={brandModels}
      phoneId={phoneId}
      brand={brand}
      isLoading={false}
      error={error}
    />
    );
}


