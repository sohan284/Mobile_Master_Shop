'use client';

import { useState } from 'react';
import { Calendar, Clock, MapPin, Mail, Phone, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function Bookings() {
  const [activeFilter, setActiveFilter] = useState('all');
  
  const bookings = [
    {
      id: 1,
      customer: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      device: 'iPhone 17 Pro Max',
      repair: 'Screen Repair',
      serviceType: 'In-Store',
      appointmentDate: '2024-01-25',
      appointmentTime: '10:00 AM',
      status: 'Confirmed',
      total: 299,
      notes: 'Cracked screen, needs original Apple part'
    },
    {
      id: 2,
      customer: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 (555) 987-6543',
      device: 'iPhone 16 Pro',
      repair: 'Battery Replacement',
      serviceType: 'Mail-In',
      appointmentDate: '2024-01-26',
      appointmentTime: '2:00 PM',
      status: 'Pending',
      total: 89,
      notes: 'Battery health at 78%'
    },
    {
      id: 3,
      customer: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+1 (555) 456-7890',
      device: 'iPhone 17',
      repair: 'Camera Repair',
      serviceType: 'In-Store',
      appointmentDate: '2024-01-24',
      appointmentTime: '3:30 PM',
      status: 'Completed',
      total: 199,
      notes: 'Rear camera not focusing properly'
    },
    {
      id: 4,
      customer: 'Sarah Wilson',
      email: 'sarah@example.com',
      phone: '+1 (555) 321-0987',
      device: 'iPhone 16 Pro Max',
      repair: 'Charging Port',
      serviceType: 'In-Store',
      appointmentDate: '2024-01-27',
      appointmentTime: '11:00 AM',
      status: 'Cancelled',
      total: 149,
      notes: 'Port not charging, needs cleaning'
    }
  ];

  const filters = [
    { id: 'all', name: 'All Bookings', count: bookings.length },
    { id: 'confirmed', name: 'Confirmed', count: bookings.filter(b => b.status === 'Confirmed').length },
    { id: 'pending', name: 'Pending', count: bookings.filter(b => b.status === 'Pending').length },
    { id: 'completed', name: 'Completed', count: bookings.filter(b => b.status === 'Completed').length },
    { id: 'cancelled', name: 'Cancelled', count: bookings.filter(b => b.status === 'Cancelled').length },
  ];

  const filteredBookings = activeFilter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status.toLowerCase() === activeFilter);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Confirmed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'Pending':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'Completed':
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case 'Cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-600">Manage customer appointments and repair bookings</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Add Booking
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Calendar View
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === filter.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {filter.name}
              <span className="ml-2 bg-gray-200 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                {filter.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bookings list */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(booking.status)}
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Booking #{booking.id}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{booking.customer}</h3>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Mail className="h-4 w-4" />
                      <span>{booking.email}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Phone className="h-4 w-4" />
                      <span>{booking.phone}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900">Device & Repair</h4>
                    <p className="text-sm text-gray-600">{booking.device}</p>
                    <p className="text-sm text-gray-600">{booking.repair}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900">Appointment</h4>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{booking.appointmentDate}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{booking.appointmentTime}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{booking.serviceType}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900">Total</h4>
                    <p className="text-lg font-semibold text-gray-900">${booking.total}</p>
                    {booking.notes && (
                      <p className="text-sm text-gray-500 mt-1">{booking.notes}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button className="bg-blue-50 text-blue-600 px-3 py-2 rounded-md hover:bg-blue-100 text-sm">
                  View Details
                </button>
                <button className="bg-green-50 text-green-600 px-3 py-2 rounded-md hover:bg-green-100 text-sm">
                  Edit
                </button>
                <button className="bg-red-50 text-red-600 px-3 py-2 rounded-md hover:bg-red-100 text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredBookings.length}</span> of{' '}
          <span className="font-medium">{bookings.length}</span> results
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
