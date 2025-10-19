'use client';

import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Package } from 'lucide-react';

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products] = useState([
    {
      id: 1,
      name: 'iPhone 15 Pro',
      category: 'Smartphones',
      price: '$999',
      stock: 45,
      status: 'Active',
      image: '📱',
      description: 'Latest iPhone with Pro features'
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24',
      category: 'Smartphones',
      price: '$899',
      stock: 32,
      status: 'Active',
      image: '📱',
      description: 'Samsung flagship smartphone'
    },
    {
      id: 3,
      name: 'MacBook Pro 16"',
      category: 'Laptops',
      price: '$2,499',
      stock: 12,
      status: 'Active',
      image: '💻',
      description: 'Apple MacBook Pro with M3 chip'
    },
    {
      id: 4,
      name: 'iPad Air',
      category: 'Tablets',
      price: '$599',
      stock: 0,
      status: 'Out of Stock',
      image: '📱',
      description: 'Apple iPad Air tablet'
    },
    {
      id: 5,
      name: 'Dell XPS 13',
      category: 'Laptops',
      price: '$1,299',
      stock: 8,
      status: 'Active',
      image: '💻',
      description: 'Dell XPS 13 laptop'
    },
    {
      id: 6,
      name: 'AirPods Pro',
      category: 'Accessories',
      price: '$249',
      stock: 67,
      status: 'Active',
      image: '🎧',
      description: 'Apple AirPods Pro with noise cancellation'
    }
  ]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product inventory and catalog</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Search and filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">All Categories</option>
            <option value="Smartphones">Smartphones</option>
            <option value="Laptops">Laptops</option>
            <option value="Tablets">Tablets</option>
            <option value="Accessories">Accessories</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">{product.image}</div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  product.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.status}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{product.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Category:</span>
                  <span className="text-gray-900">{product.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Price:</span>
                  <span className="text-gray-900 font-semibold">{product.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Stock:</span>
                  <span className={`font-semibold ${
                    product.stock === 0 ? 'text-red-600' : 
                    product.stock < 10 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {product.stock} units
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-md hover:bg-blue-100 flex items-center justify-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </button>
                <button className="flex-1 bg-green-50 text-green-600 px-3 py-2 rounded-md hover:bg-green-100 flex items-center justify-center space-x-1">
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button className="bg-red-50 text-red-600 px-3 py-2 rounded-md hover:bg-red-100">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">1</span> to <span className="font-medium">6</span> of{' '}
          <span className="font-medium">{products.length}</span> results
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
            Previous
          </button>
          <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md">
            1
          </button>
          <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
