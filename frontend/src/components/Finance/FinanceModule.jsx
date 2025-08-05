import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Users, Calendar, Download, Plus, Search, Filter } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const FinanceModule = () => {
  const [financeData, setFinanceData] = useState({
    totalCollected: 0,
    totalPending: 0,
    monthlyRevenue: 0,
    overdueAmount: 0
  });
  const [transactions, setTransactions] = useState([]);
  const [feeStructure, setFeeStructure] = useState([]);
  const [revenueChart, setRevenueChart] = useState([]);
  const [collectionChart, setCollectionChart] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const API_URL = import.meta.env.VITE_API_URL || 'https://school-backend-1ops.onrender.com';

  useEffect(() => {
    fetchFinanceData();
    fetchTransactions();
    fetchFeeStructure();
  }, []);

  const fetchFinanceData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/finance/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setFinanceData(data.data.stats);
        setRevenueChart(data.data.monthlyRevenue || []);
        
        // Calculate collection chart data
        const collected = data.data.stats.totalCollected;
        const pending = data.data.stats.totalPending;
        const total = collected + pending;
        
        setCollectionChart([
          { name: 'Collected', value: collected, color: '#10B981' },
          { name: 'Pending', value: pending, color: '#EF4444' }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch finance data:', error);
      // Set mock data for demo
      setFinanceData({
        totalCollected: 125000,
        totalPending: 35000,
        monthlyRevenue: 45000,
        overdueAmount: 12000
      });
      
      setRevenueChart([
        { month: 'Jan', revenue: 42000 },
        { month: 'Feb', revenue: 38000 },
        { month: 'Mar', revenue: 45000 },
        { month: 'Apr', revenue: 41000 },
        { month: 'May', revenue: 47000 },
        { month: 'Jun', revenue: 45000 }
      ]);
      
      setCollectionChart([
        { name: 'Collected', value: 125000, color: '#10B981' },
        { name: 'Pending', value: 35000, color: '#EF4444' }
      ]);
    }
  };

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/finance/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setTransactions(data.data || []);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      // Set mock data
      setTransactions([
        {
          _id: '1',
          studentName: 'John Doe',
          studentId: 'STU001',
          amount: 5000,
          feeType: 'Tuition Fee',
          status: 'paid',
          date: new Date().toISOString(),
          paymentMethod: 'Bank Transfer'
        },
        {
          _id: '2',
          studentName: 'Jane Smith',
          studentId: 'STU002',
          amount: 3000,
          feeType: 'Library Fee',
          status: 'pending',
          date: new Date().toISOString(),
          paymentMethod: 'Cash'
        }
      ]);
    }
  };

  const fetchFeeStructure = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/finance/fee-structure`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setFeeStructure(data.data || []);
    } catch (error) {
      console.error('Failed to fetch fee structure:', error);
      // Set mock data
      setFeeStructure([
        { _id: '1', class: 'Grade 1-5', tuitionFee: 5000, libraryFee: 500, labFee: 300, sportsFee: 200 },
        { _id: '2', class: 'Grade 6-8', tuitionFee: 6000, libraryFee: 600, labFee: 400, sportsFee: 300 },
        { _id: '3', class: 'Grade 9-10', tuitionFee: 7000, libraryFee: 700, labFee: 500, sportsFee: 400 }
      ]);
    }
  };

  const generateInvoice = async (studentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/finance/invoice/${studentId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${studentId}.pdf`;
        a.click();
      }
    } catch (error) {
      console.error('Failed to generate invoice:', error);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || transaction.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const StatCard = ({ title, value, icon: Icon, color, change, prefix = '' }) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{prefix}{value.toLocaleString()}</p>
          {change && (
            <p className={`text-sm mt-2 flex items-center ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {change > 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Finance Management
            </h1>
            <p className="text-gray-600 mt-2">Track fees, payments, and financial reports</p>
          </div>
          <button
            onClick={() => setShowInvoiceModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Generate Invoice
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded-lg font-semibold ${
            activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          <DollarSign className="inline w-5 h-5 mr-2" />
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 rounded-lg font-semibold ${
            activeTab === 'transactions' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Transactions
        </button>
        <button
          onClick={() => setActiveTab('fee-structure')}
          className={`px-4 py-2 rounded-lg font-semibold ${
            activeTab === 'fee-structure' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Fee Structure
        </button>
      </div>

      {activeTab === 'dashboard' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Collected"
              value={financeData.totalCollected}
              icon={DollarSign}
              color="bg-gradient-to-r from-green-500 to-green-600"
              change={8.2}
              prefix="$"
            />
            <StatCard
              title="Pending Amount"
              value={financeData.totalPending}
              icon={TrendingDown}
              color="bg-gradient-to-r from-red-500 to-red-600"
              change={-3.1}
              prefix="$"
            />
            <StatCard
              title="Monthly Revenue"
              value={financeData.monthlyRevenue}
              icon={TrendingUp}
              color="bg-gradient-to-r from-blue-500 to-blue-600"
              change={12.5}
              prefix="$"
            />
            <StatCard
              title="Overdue Amount"
              value={financeData.overdueAmount}
              icon={Calendar}
              color="bg-gradient-to-r from-orange-500 to-orange-600"
              change={-5.3}
              prefix="$"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Monthly Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Collection Overview */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Fee Collection Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={collectionChart}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {collectionChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {activeTab === 'transactions' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by student name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Student</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Fee Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{transaction.studentName}</p>
                        <p className="text-sm text-gray-500">{transaction.studentId}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      ${transaction.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{transaction.feeType}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.status === 'paid' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => generateInvoice(transaction.studentId)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
                      >
                        <Download className="w-4 h-4" />
                        Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'fee-structure' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Fee Structure</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Class</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Tuition Fee</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Library Fee</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Lab Fee</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Sports Fee</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {feeStructure.map((fee) => (
                  <tr key={fee._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{fee.class}</td>
                    <td className="px-4 py-3 text-gray-600">${fee.tuitionFee}</td>
                    <td className="px-4 py-3 text-gray-600">${fee.libraryFee}</td>
                    <td className="px-4 py-3 text-gray-600">${fee.labFee}</td>
                    <td className="px-4 py-3 text-gray-600">${fee.sportsFee}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      ${(fee.tuitionFee + fee.libraryFee + fee.labFee + fee.sportsFee).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceModule;