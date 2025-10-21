'use client';

import { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  CreditCard, 
  Shield,
  Bell,
  Globe,
  Save
} from 'lucide-react';
import PageTransition from '@/components/animations/PageTransition';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('business');
  
  const [businessInfo, setBusinessInfo] = useState({
    name: 'MobileShop Repair',
    email: 'info@mobileshoprepair.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, City, State 12345',
    hours: 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM, Sun: Closed',
    description: 'Professional iPhone and Android repair services with original and compatible parts.'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    bookingReminders: true,
    lowStockAlerts: true,
    newOrderAlerts: true,
    systemUpdates: false
  });

  const [paymentSettings, setPaymentSettings] = useState({
    stripeEnabled: true,
    paypalEnabled: false,
    cashEnabled: true,
    cardEnabled: true,
    currency: 'USD',
    taxRate: 8.5
  });

  const tabs = [
    { id: 'business', name: 'Business Info', icon: Building },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'payments', name: 'Payments', icon: CreditCard },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'website', name: 'Website', icon: Globe },
  ];

  const handleSave = () => {
    // Handle save logic here
    console.log('Settings saved');
  };

  return (
    <PageTransition>
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your business settings and preferences</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Business Info Tab */}
      {activeTab === 'business' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Business Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
              <input
                type="text"
                value={businessInfo.name}
                onChange={(e) => setBusinessInfo({...businessInfo, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={businessInfo.email}
                onChange={(e) => setBusinessInfo({...businessInfo, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={businessInfo.phone}
                onChange={(e) => setBusinessInfo({...businessInfo, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Hours</label>
              <input
                type="text"
                value={businessInfo.hours}
                onChange={(e) => setBusinessInfo({...businessInfo, hours: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                type="text"
                value={businessInfo.address}
                onChange={(e) => setBusinessInfo({...businessInfo, address: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={businessInfo.description}
                onChange={(e) => setBusinessInfo({...businessInfo, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Settings</h2>
          <div className="space-y-4">
            {Object.entries(notificationSettings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </div>
                  <div className="text-sm text-gray-500">
                    {key === 'emailNotifications' && 'Receive email notifications for important updates'}
                    {key === 'smsNotifications' && 'Receive SMS notifications for urgent matters'}
                    {key === 'bookingReminders' && 'Get reminders about upcoming appointments'}
                    {key === 'lowStockAlerts' && 'Get notified when inventory is running low'}
                    {key === 'newOrderAlerts' && 'Get notified when new orders are placed'}
                    {key === 'systemUpdates' && 'Receive notifications about system updates'}
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setNotificationSettings({...notificationSettings, [key]: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Payment Settings</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">Payment Methods</h3>
              <div className="space-y-4">
                {Object.entries(paymentSettings).slice(0, 4).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-900">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setPaymentSettings({...paymentSettings, [key]: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                  value={paymentSettings.currency}
                  onChange={(e) => setPaymentSettings({...paymentSettings, currency: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD (C$)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={paymentSettings.taxRate}
                  onChange={(e) => setPaymentSettings({...paymentSettings, taxRate: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">Password</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Change Password
              </button>
            </div>
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Enable 2FA</div>
                  <div className="text-sm text-gray-500">Add an extra layer of security to your account</div>
                </div>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  Enable
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">Login Sessions</h3>
              <div className="text-sm text-gray-500 mb-2">Manage your active login sessions</div>
              <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                View Sessions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Website Tab */}
      {activeTab === 'website' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Website Settings</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">SEO Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Title</label>
                  <input
                    type="text"
                    defaultValue="MobileShop Repair - Professional Phone Repair Services"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                  <input
                    type="text"
                    defaultValue="Professional iPhone and Android repair services with original and compatible parts. Fast, reliable, and affordable."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">Social Media</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label>
                  <input
                    type="url"
                    placeholder="https://facebook.com/yourpage"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instagram URL</label>
                  <input
                    type="url"
                    placeholder="https://instagram.com/yourpage"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </PageTransition>
  );
}
