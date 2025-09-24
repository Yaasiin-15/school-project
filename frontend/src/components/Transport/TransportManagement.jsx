import React, { useState, useEffect } from 'react';
import { 
  Bus, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  MapPin,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const TransportManagement = () => {
  const [activeTab, setActiveTab] = useState('routes');
  const [routes, setRoutes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data
  const mockRoutes = [
    {
      _id: '1',
      routeId: 'RT001',
      routeName: 'Downtown Route',
      routeNumber: 'R001',
      startLocation: { name: 'School Campus' },
      endLocation: { name: 'Downtown Terminal' },
      stops: [
        { name: 'Main Street', sequence: 1 },
        { name: 'City Center', sequence: 2 },
        { name: 'Shopping Mall', sequence: 3 }
      ],
      status: 'active',
      distance: 15.5,
      estimatedDuration: 45
    },
    {
      _id: '2',
      routeId: 'RT002',
      routeName: 'Suburban Route',
      routeNumber: 'R002',
      startLocation: { name: 'School Campus' },
      endLocation: { name: 'Suburban Area' },
      stops: [
        { name: 'Residential Complex A', sequence: 1 },
        { name: 'Park Avenue', sequence: 2 }
      ],
      status: 'active',
      distance: 12.3,
      estimatedDuration: 35
    }
  ];

  const mockVehicles = [
    {
      _id: '1',
      vehicleId: 'VH001',
      registrationNumber: 'ABC-123',
      vehicleType: 'bus',
      make: 'Tata',
      model: 'Starbus',
      capacity: { seating: 45, standing: 0 },
      status: 'active',
      assignedRoute: { routeName: 'Downtown Route' },
      driver: { name: 'John Driver' }
    },
    {
      _id: '2',
      vehicleId: 'VH002',
      registrationNumber: 'XYZ-456',
      vehicleType: 'van',
      make: 'Mahindra',
      model: 'Bolero',
      capacity: { seating: 12, standing: 0 },
      status: 'maintenance',
      assignedRoute: null,
      driver: null
    }
  ];

  const mockDrivers = [
    {
      _id: '1',
      driverId: 'DR001',
      name: 'John Driver',
      phone: '+1234567890',
      license: { number: 'DL123456', expiryDate: '2025-12-31' },
      experience: 8,
      status: 'active',
      assignedVehicles: [{ registrationNumber: 'ABC-123' }]
    },
    {
      _id: '2',
      driverId: 'DR002',
      name: 'Mike Wilson',
      phone: '+1234567891',
      license: { number: 'DL789012', expiryDate: '2024-06-30' },
      experience: 5,
      status: 'active',
      assignedVehicles: []
    }
  ];

  useEffect(() => {
    fetchTransportData();
  }, []);

  const fetchTransportData = async () => {
    setLoading(true);
    try {
      // Mock API calls - replace with actual service calls
      setRoutes(mockRoutes);
      setVehicles(mockVehicles);
      setDrivers(mockDrivers);
    } catch (err) {
      setError('Failed to fetch transport data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setShowAddModal(true);
  };

  const handleEdit = (item) => {
    console.log('Edit:', item);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        // Mock delete - replace with actual API call
        console.log('Delete:', id);
      } catch (err) {
        setError('Failed to delete item');
      }
    }
  };

  const filteredData = () => {
    let data = [];
    switch (activeTab) {
      case 'routes':
        data = routes;
        break;
      case 'vehicles':
        data = vehicles;
        break;
      case 'drivers':
        data = drivers;
        break;
      default:
        data = [];
    }

    return data.filter(item => {
      const searchFields = [
        item.routeName || '',
        item.routeNumber || '',
        item.registrationNumber || '',
        item.name || '',
        item.driverId || '',
        item.vehicleId || ''
      ];
      return searchFields.some(field => 
        field.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Bus className="mr-3 text-blue-600" />
                Transport Management
              </h1>
              <p className="text-gray-600 mt-1">Manage routes, vehicles, and drivers</p>
            </div>
            <button
              onClick={handleAddNew}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <MapPin className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Routes</p>
                <p className="text-2xl font-bold text-gray-900">{routes.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <Bus className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Active Vehicles</p>
                <p className="text-2xl font-bold text-green-600">
                  {vehicles.filter(v => v.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Active Drivers</p>
                <p className="text-2xl font-bold text-purple-600">
                  {drivers.filter(d => d.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Maintenance</p>
                <p className="text-2xl font-bold text-red-600">
                  {vehicles.filter(v => v.status === 'maintenance').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs and Content */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {['routes', 'vehicles', 'drivers'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Search Bar */}
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                {activeTab === 'routes' && (
                  <RoutesTab 
                    routes={filteredData()} 
                    onEdit={handleEdit} 
                    onDelete={handleDelete} 
                  />
                )}
                {activeTab === 'vehicles' && (
                  <VehiclesTab 
                    vehicles={filteredData()} 
                    onEdit={handleEdit} 
                    onDelete={handleDelete} 
                  />
                )}
                {activeTab === 'drivers' && (
                  <DriversTab 
                    drivers={filteredData()} 
                    onEdit={handleEdit} 
                    onDelete={handleDelete} 
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Routes Tab Component
const RoutesTab = ({ routes, onEdit, onDelete }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Route Details
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Stops
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Distance & Duration
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {routes.map((route) => (
          <tr key={route._id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              <div>
                <div className="text-sm font-medium text-gray-900">{route.routeName}</div>
                <div className="text-sm text-gray-500">#{route.routeNumber}</div>
                <div className="text-xs text-gray-400">
                  {route.startLocation.name} → {route.endLocation.name}
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{route.stops.length} stops</div>
              <div className="text-xs text-gray-500">
                {route.stops.slice(0, 2).map(stop => stop.name).join(', ')}
                {route.stops.length > 2 && '...'}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{route.distance} km</div>
              <div className="text-sm text-gray-500">{route.estimatedDuration} min</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                route.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {route.status}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div className="flex items-center space-x-2">
                <button onClick={() => onEdit(route)} className="text-blue-600 hover:text-blue-900">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="text-green-600 hover:text-green-900">
                  <Eye className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(route._id)} className="text-red-600 hover:text-red-900">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Vehicles Tab Component
const VehiclesTab = ({ vehicles, onEdit, onDelete }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Vehicle Details
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Capacity
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Assignment
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {vehicles.map((vehicle) => (
          <tr key={vehicle._id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              <div>
                <div className="text-sm font-medium text-gray-900">{vehicle.registrationNumber}</div>
                <div className="text-sm text-gray-500">{vehicle.make} {vehicle.model}</div>
                <div className="text-xs text-gray-400 capitalize">{vehicle.vehicleType}</div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{vehicle.capacity.seating} seats</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">
                {vehicle.assignedRoute?.routeName || 'Unassigned'}
              </div>
              <div className="text-sm text-gray-500">
                {vehicle.driver?.name || 'No driver'}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                vehicle.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : vehicle.status === 'maintenance'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {vehicle.status}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div className="flex items-center space-x-2">
                <button onClick={() => onEdit(vehicle)} className="text-blue-600 hover:text-blue-900">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="text-green-600 hover:text-green-900">
                  <Eye className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(vehicle._id)} className="text-red-600 hover:text-red-900">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Drivers Tab Component
const DriversTab = ({ drivers, onEdit, onDelete }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Driver Details
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            License Info
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Experience
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Assignment
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {drivers.map((driver) => (
          <tr key={driver._id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              <div>
                <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                <div className="text-sm text-gray-500">{driver.phone}</div>
                <div className="text-xs text-gray-400">ID: {driver.driverId}</div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{driver.license.number}</div>
              <div className="text-sm text-gray-500">
                Expires: {new Date(driver.license.expiryDate).toLocaleDateString()}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{driver.experience} years</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">
                {driver.assignedVehicles.length > 0 
                  ? driver.assignedVehicles.map(v => v.registrationNumber).join(', ')
                  : 'Unassigned'
                }
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                driver.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {driver.status}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div className="flex items-center space-x-2">
                <button onClick={() => onEdit(driver)} className="text-blue-600 hover:text-blue-900">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="text-green-600 hover:text-green-900">
                  <Eye className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(driver._id)} className="text-red-600 hover:text-red-900">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TransportManagement;