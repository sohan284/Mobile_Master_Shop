'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Smartphone, Wrench, DollarSign } from 'lucide-react';

export default function RepairServices() {
  const [activeTab, setActiveTab] = useState('models');
  
  const iphoneModels = [
    { id: 1, name: 'iPhone 17 Pro Max', year: '2024', status: 'Active', repairs: 45 },
    { id: 2, name: 'iPhone 17 Pro', year: '2024', status: 'Active', repairs: 38 },
    { id: 3, name: 'iPhone 17', year: '2024', status: 'Active', repairs: 52 },
    { id: 4, name: 'iPhone 17 Air', year: '2024', status: 'Active', repairs: 29 },
    { id: 5, name: 'iPhone 16 Pro Max', year: '2023', status: 'Active', repairs: 67 },
    { id: 6, name: 'iPhone 16 Pro', year: '2023', status: 'Active', repairs: 41 },
    { id: 7, name: 'iPhone 16', year: '2023', status: 'Active', repairs: 58 },
  ];

  const repairTypes = [
    { id: 1, name: 'Screen Repair', originalPrice: 299, compatiblePrice: 199, duration: '2-3 hours' },
    { id: 2, name: 'Battery Replacement', originalPrice: 89, compatiblePrice: 59, duration: '1 hour' },
    { id: 3, name: 'Camera Repair', originalPrice: 199, compatiblePrice: 129, duration: '2 hours' },
    { id: 4, name: 'Charging Port', originalPrice: 149, compatiblePrice: 99, duration: '1.5 hours' },
    { id: 5, name: 'Back Glass', originalPrice: 179, compatiblePrice: 119, duration: '2 hours' },
    { id: 6, name: 'Speaker Repair', originalPrice: 79, compatiblePrice: 49, duration: '1 hour' },
  ];

  const tabs = [
    { id: 'models', name: 'iPhone Models', count: iphoneModels.length },
    { id: 'repairs', name: 'Repair Types', count: repairTypes.length },
    { id: 'pricing', name: 'Pricing Matrix', count: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Repair Services</h1>
          <p className="text-gray-600">Manage iPhone models, repair types, and pricing</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Service</span>
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

      {/* iPhone Models Tab */}
      {activeTab === 'models' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {iphoneModels.map((model) => (
              <div key={model.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Smartphone className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{model.name}</h3>
                      <p className="text-sm text-gray-500">Year: {model.year}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    model.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {model.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Repairs:</span>
                    <span className="text-gray-900 font-semibold">{model.repairs}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-md hover:bg-blue-100 flex items-center justify-center space-x-1">
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
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

      {/* Repair Types Tab */}
      {activeTab === 'repairs' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Repair Types & Pricing</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Repair Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Original Apple
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Compatible
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {repairTypes.map((repair) => (
                  <tr key={repair.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Wrench className="h-5 w-5 text-gray-400 mr-3" />
                        <div className="text-sm font-medium text-gray-900">{repair.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                        <span className="text-sm text-gray-900 font-semibold">${repair.originalPrice}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-blue-600 mr-1" />
                        <span className="text-sm text-gray-900 font-semibold">${repair.compatiblePrice}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {repair.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Edit className="h-4 w-4" />
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

      {/* Pricing Matrix Tab */}
      {activeTab === 'pricing' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing Matrix</h2>
          <div className="text-center py-12">
            <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Pricing Matrix</h3>
            <p className="text-gray-500">Configure pricing for each iPhone model and repair type combination.</p>
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Configure Pricing
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
