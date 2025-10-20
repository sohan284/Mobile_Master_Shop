'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Megaphone, Video, Gift, Settings, Eye } from 'lucide-react';
import PageTransition from '@/components/animations/PageTransition';

export default function Content() {
  const [activeTab, setActiveTab] = useState('offers');
  
  const promotionalOffers = [
    {
      id: 1,
      title: 'Welcome Offer - 10% Off First Repair',
      description: 'Get 10% off your first repair service',
      discount: '10%',
      type: 'Percentage',
      status: 'Active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      usage: 45,
      maxUsage: 100
    },
    {
      id: 2,
      title: 'Free Accessory with Any Repair',
      description: 'Get a free screen protector with any repair service',
      discount: 'Free',
      type: 'Free Item',
      status: 'Active',
      startDate: '2024-01-15',
      endDate: '2024-03-15',
      usage: 23,
      maxUsage: 50
    },
    {
      id: 3,
      title: 'Battery Replacement Special',
      description: '20% off all battery replacement services',
      discount: '20%',
      type: 'Percentage',
      status: 'Inactive',
      startDate: '2024-01-10',
      endDate: '2024-01-20',
      usage: 12,
      maxUsage: 25
    }
  ];

  const homepageContent = [
    {
      id: 1,
      title: 'Hero Section',
      type: 'Hero',
      status: 'Published',
      lastUpdated: '2024-01-20',
      content: 'Professional iPhone & Android Repair Services'
    },
    {
      id: 2,
      title: 'Video Presentation - Scratch Removal Machine',
      type: 'Video',
      status: 'Draft',
      lastUpdated: '2024-01-18',
      content: 'Coming Soon: Revolutionary scratch removal technology'
    },
    {
      id: 3,
      title: 'Services Overview',
      type: 'Content',
      status: 'Published',
      lastUpdated: '2024-01-15',
      content: 'Screen repair, battery replacement, camera fixes, and more'
    },
    {
      id: 4,
      title: 'Customer Testimonials',
      type: 'Testimonials',
      status: 'Published',
      lastUpdated: '2024-01-12',
      content: 'What our customers say about our services'
    }
  ];

  const tabs = [
    { id: 'offers', name: 'Promotional Offers', count: promotionalOffers.length },
    { id: 'content', name: 'Homepage Content', count: homepageContent.length },
    { id: 'banners', name: 'Banners & Ads', count: 0 },
    { id: 'seo', name: 'SEO Content', count: 0 },
  ];

  return (
    <PageTransition>
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600">Manage promotional offers, homepage content, and marketing materials</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Content</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
              <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Promotional Offers Tab */}
      {activeTab === 'offers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotionalOffers.map((offer) => (
              <div key={offer.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Gift className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{offer.title}</h3>
                      <p className="text-sm text-gray-500">{offer.description}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    offer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {offer.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Discount:</span>
                    <span className="text-gray-900 font-semibold">{offer.discount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Type:</span>
                    <span className="text-gray-900">{offer.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Usage:</span>
                    <span className="text-gray-900">{offer.usage}/{offer.maxUsage}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Valid Until:</span>
                    <span className="text-gray-900">{offer.endDate}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-md hover:bg-blue-100 flex items-center justify-center space-x-1">
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  <button className="bg-green-50 text-green-600 px-3 py-2 rounded-md hover:bg-green-100 flex items-center justify-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </button>
                  <button className="bg-red-50 text-red-600 px-3 py-2 rounded-md hover:bg-red-100">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Homepage Content Tab */}
      {activeTab === 'content' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Homepage Content</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Content
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {homepageContent.map((content) => (
                  <tr key={content.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{content.title}</div>
                        <div className="text-sm text-gray-500">{content.content}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {content.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        content.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {content.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {content.lastUpdated}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Banners & Ads Tab */}
      {activeTab === 'banners' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center py-12">
            <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Banners & Ads</h3>
            <p className="text-gray-500">Manage promotional banners and advertisements for your website.</p>
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Create Banner
            </button>
          </div>
        </div>
      )}

      {/* SEO Content Tab */}
      {activeTab === 'seo' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center py-12">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">SEO Content</h3>
            <p className="text-gray-500">Manage SEO content, meta descriptions, and keywords for better search visibility.</p>
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Manage SEO
            </button>
          </div>
        </div>
      )}
    </div>
    </PageTransition>
  );
}
