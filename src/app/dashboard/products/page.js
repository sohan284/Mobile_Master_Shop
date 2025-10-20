'use client';

import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Package, Smartphone, Headphones, Shield } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalTab, setModalTab] = useState('phones');
  
  // Separate data for phones and accessories
  const [phones] = useState([
    // iPhones
    {
      id: 1,
      name: 'iPhone 17 Pro Max',
      type: 'iPhone',
      price: '$1199',
      stock: 12,
      status: 'Active',
      image: '📱',
      description: 'Latest iPhone with Pro Max features',
      brand: 'Apple',
      model: '17 Pro Max',
      storage: '256GB',
      color: 'Space Black',
      screenSize: '6.9"',
      camera: '48MP',
      battery: '4422mAh'
    },
    {
      id: 2,
      name: 'iPhone 17 Pro',
      type: 'iPhone',
      price: '$999',
      stock: 18,
      status: 'Active',
      image: '📱',
      description: 'iPhone 17 Pro with advanced camera system',
      brand: 'Apple',
      model: '17 Pro',
      storage: '128GB',
      color: 'Natural Titanium',
      screenSize: '6.1"',
      camera: '48MP',
      battery: '3274mAh'
    },
    {
      id: 3,
      name: 'iPhone 16 Pro Max',
      type: 'iPhone',
      price: '$1099',
      stock: 8,
      status: 'Active',
      image: '📱',
      description: 'Previous generation Pro Max',
      brand: 'Apple',
      model: '16 Pro Max',
      storage: '256GB',
      color: 'Deep Purple',
      screenSize: '6.9"',
      camera: '48MP',
      battery: '4422mAh'
    },
    // Android Phones
    {
      id: 4,
      name: 'Samsung Galaxy S24 Ultra',
      type: 'Android',
      price: '$1299',
      stock: 15,
      status: 'Active',
      image: '📱',
      description: 'Samsung flagship with S Pen',
      brand: 'Samsung',
      model: 'S24 Ultra',
      storage: '512GB',
      color: 'Titanium Black',
      screenSize: '6.8"',
      camera: '200MP',
      battery: '5000mAh'
    },
    {
      id: 5,
      name: 'Google Pixel 8 Pro',
      type: 'Android',
      price: '$999',
      stock: 22,
      status: 'Active',
      image: '📱',
      description: 'Google Pixel with AI features',
      brand: 'Google',
      model: 'Pixel 8 Pro',
      storage: '256GB',
      color: 'Obsidian',
      screenSize: '6.7"',
      camera: '50MP',
      battery: '5050mAh'
    },
    {
      id: 6,
      name: 'OnePlus 12',
      type: 'Android',
      price: '$799',
      stock: 14,
      status: 'Active',
      image: '📱',
      description: 'OnePlus flagship smartphone',
      brand: 'OnePlus',
      model: '12',
      storage: '256GB',
      color: 'Silky Black',
      screenSize: '6.82"',
      camera: '50MP',
      battery: '5400mAh'
    }
  ]);

  const [accessories] = useState([
    {
      id: 7,
      name: 'AirPods Pro (2nd Gen)',
      type: 'Audio',
      price: '$249',
      stock: 45,
      status: 'Active',
      image: '🎧',
      description: 'Apple AirPods Pro with noise cancellation',
      brand: 'Apple',
      model: 'AirPods Pro',
      color: 'White',
      compatibility: 'iPhone, iPad, Mac',
      features: 'Noise Cancellation, Spatial Audio'
    },
    {
      id: 8,
      name: 'iPhone 17 Pro Max Case',
      type: 'Protection',
      price: '$49',
      stock: 67,
      status: 'Active',
      image: '🛡️',
      description: 'Protective case for iPhone 17 Pro Max',
      brand: 'Apple',
      model: 'Clear Case',
      color: 'Clear',
      compatibility: 'iPhone 17 Pro Max',
      features: 'Drop Protection, MagSafe Compatible'
    },
    {
      id: 9,
      name: 'MagSafe Charger',
      type: 'Charging',
      price: '$39',
      stock: 89,
      status: 'Active',
      image: '🔌',
      description: 'Apple MagSafe wireless charger',
      brand: 'Apple',
      model: 'MagSafe',
      color: 'White',
      compatibility: 'iPhone 12 and newer',
      features: '15W Fast Charging, Magnetic Alignment'
    },
    {
      id: 10,
      name: 'Lightning Cable',
      type: 'Charging',
      price: '$19',
      stock: 120,
      status: 'Active',
      image: '🔌',
      description: 'Apple Lightning to USB-C cable',
      brand: 'Apple',
      model: 'Lightning Cable',
      color: 'White',
      compatibility: 'iPhone, iPad',
      features: '1m Length, Fast Charging'
    }
  ]);

  // Combine all products for display
  const allProducts = [...phones, ...accessories];

  const categories = [
    { id: 'all', name: 'All Products', icon: Package, count: allProducts.length },
    { id: 'phones', name: 'Phones', icon: Smartphone, count: phones.length },
    { id: 'accessories', name: 'Accessories', icon: Headphones, count: accessories.length },
  ];

  const getFilteredProducts = () => {
    let productsToFilter = allProducts;
    
    if (activeCategory === 'phones') {
      productsToFilter = phones;
    } else if (activeCategory === 'accessories') {
      productsToFilter = accessories;
    }

    return productsToFilter.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.model.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product inventory and catalog</p>
        </div>
        <Dialog className='' open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Product</span>
            </button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-4xl bg-white">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Add a new phone or accessory to your inventory.
              </DialogDescription>
            </DialogHeader>

            {/* Modal Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setModalTab('phones')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    modalTab === 'phones'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Smartphone className="h-4 w-4" />
                  <span>Phones</span>
                </button>
                <button
                  onClick={() => setModalTab('accessories')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    modalTab === 'accessories'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Headphones className="h-4 w-4" />
                  <span>Accessories</span>
                </button>
              </nav>
            </div>

            {/* Phone Form */}
            {modalTab === 'phones' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input
                      type="text"
                      placeholder="e.g., iPhone 17 Pro Max"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Select Brand</option>
                      <option value="Apple">Apple</option>
                      <option value="Samsung">Samsung</option>
                      <option value="Google">Google</option>
                      <option value="OnePlus">OnePlus</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                    <input
                      type="text"
                      placeholder="e.g., 17 Pro Max"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="iPhone">iPhone</option>
                      <option value="Android">Android</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Storage</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="64GB">64GB</option>
                      <option value="128GB">128GB</option>
                      <option value="256GB">256GB</option>
                      <option value="512GB">512GB</option>
                      <option value="1TB">1TB</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                    <input
                      type="text"
                      placeholder="e.g., Space Black"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Screen Size</label>
                    <input
                      type="text"
                      placeholder="e.g., 6.9&quot;"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Camera</label>
                    <input
                      type="text"
                      placeholder="e.g., 48MP"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Battery</label>
                    <input
                      type="text"
                      placeholder="e.g., 4422mAh"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                      type="text"
                      placeholder="e.g., $1199"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input
                      type="number"
                      placeholder="e.g., 12"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Product description..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Accessories Form */}
            {modalTab === 'accessories' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input
                      type="text"
                      placeholder="e.g., AirPods Pro (2nd Gen)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Select Brand</option>
                      <option value="Apple">Apple</option>
                      <option value="Samsung">Samsung</option>
                      <option value="Google">Google</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                    <input
                      type="text"
                      placeholder="e.g., AirPods Pro"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="Audio">Audio</option>
                      <option value="Protection">Protection</option>
                      <option value="Charging">Charging</option>
                      <option value="Cable">Cable</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                    <input
                      type="text"
                      placeholder="e.g., White"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Compatibility</label>
                    <input
                      type="text"
                      placeholder="e.g., iPhone, iPad, Mac"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
                    <input
                      type="text"
                      placeholder="e.g., Noise Cancellation, Spatial Audio"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                      type="text"
                      placeholder="e.g., $249"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input
                      type="number"
                      placeholder="e.g., 45"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Product description..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Add Product
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search products by name, brand, or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
        
        {/* Category tabs */}
        <div className="mt-4 flex items-center space-x-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <category.icon className="h-4 w-4" />
              <span>{category.name}</span>
              <span className="bg-gray-200 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                {category.count}
              </span>
            </button>
          ))}
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
                  <span className="text-gray-500">Brand:</span>
                  <span className="text-gray-900">{product.brand}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Model:</span>
                  <span className="text-gray-900">{product.model}</span>
                </div>
                {product.storage && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Storage:</span>
                    <span className="text-gray-900">{product.storage}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Color:</span>
                  <span className="text-gray-900">{product.color}</span>
                </div>
                {product.screenSize && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Screen:</span>
                    <span className="text-gray-900">{product.screenSize}</span>
                  </div>
                )}
                {product.camera && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Camera:</span>
                    <span className="text-gray-900">{product.camera}</span>
                  </div>
                )}
                {product.battery && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Battery:</span>
                    <span className="text-gray-900">{product.battery}</span>
                  </div>
                )}
                {product.compatibility && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Compatibility:</span>
                    <span className="text-gray-900">{product.compatibility}</span>
                  </div>
                )}
                {product.features && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Features:</span>
                    <span className="text-gray-900">{product.features}</span>
                  </div>
                )}
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
          <span className="font-medium">{phones.length}</span> results
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
