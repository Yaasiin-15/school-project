import React, { useState, useEffect } from 'react';
import { 
  Book, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  BookOpen,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Download
} from 'lucide-react';

const LibraryManagement = () => {
  const [activeTab, setActiveTab] = useState('books');
  const [books, setBooks] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [libraryStats, setLibraryStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    issuedBooks: 0,
    overdueBooks: 0
  });

  // Mock data - replace with actual API calls
  const mockBooks = [
    {
      _id: '1',
      bookId: 'BK001',
      title: 'Introduction to Mathematics',
      author: 'John Smith',
      isbn: '978-0123456789',
      category: 'textbook',
      subject: 'Mathematics',
      copies: { total: 5, available: 3, issued: 2 },
      status: 'active'
    },
    {
      _id: '2',
      bookId: 'BK002',
      title: 'English Literature',
      author: 'Jane Doe',
      isbn: '978-0987654321',
      category: 'textbook',
      subject: 'English',
      copies: { total: 8, available: 6, issued: 2 },
      status: 'active'
    },
    {
      _id: '3',
      bookId: 'BK003',
      title: 'Science Experiments',
      author: 'Dr. Brown',
      isbn: '978-0456789123',
      category: 'reference',
      subject: 'Science',
      copies: { total: 3, available: 1, issued: 2 },
      status: 'active'
    }
  ];

  const mockIssues = [
    {
      _id: '1',
      issueId: 'ISS001',
      book: { title: 'Introduction to Mathematics', bookId: 'BK001' },
      borrower: { name: 'Alice Johnson', email: 'alice@school.com' },
      issueDate: '2024-01-15',
      dueDate: '2024-01-29',
      status: 'issued'
    },
    {
      _id: '2',
      issueId: 'ISS002',
      book: { title: 'English Literature', bookId: 'BK002' },
      borrower: { name: 'Bob Wilson', email: 'bob@school.com' },
      issueDate: '2024-01-10',
      dueDate: '2024-01-24',
      status: 'overdue'
    }
  ];

  useEffect(() => {
    fetchLibraryData();
  }, []);

  const fetchLibraryData = async () => {
    setLoading(true);
    try {
      // Mock API calls - replace with actual service calls
      setBooks(mockBooks);
      setIssues(mockIssues);
      setLibraryStats({
        totalBooks: mockBooks.length,
        availableBooks: mockBooks.reduce((sum, book) => sum + book.copies.available, 0),
        issuedBooks: mockBooks.reduce((sum, book) => sum + book.copies.issued, 0),
        overdueBooks: mockIssues.filter(issue => issue.status === 'overdue').length
      });
    } catch (err) {
      setError('Failed to fetch library data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = () => {
    setSelectedBook(null);
    setShowAddModal(true);
  };

  const handleEditBook = (book) => {
    setSelectedBook(book);
    setShowAddModal(true);
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        // Mock delete - replace with actual API call
        setBooks(books.filter(book => book._id !== bookId));
      } catch (err) {
        setError('Failed to delete book');
      }
    }
  };

  const handleIssueBook = (book) => {
    // Open issue book modal
    console.log('Issue book:', book);
  };

  const handleReturnBook = async (issueId) => {
    try {
      // Mock return - replace with actual API call
      setIssues(issues.map(issue => 
        issue._id === issueId 
          ? { ...issue, status: 'returned', returnDate: new Date().toISOString() }
          : issue
      ));
    } catch (err) {
      setError('Failed to return book');
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.isbn.includes(searchTerm);
    const matchesCategory = categoryFilter === 'all' || book.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredIssues = issues.filter(issue => 
    issue.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.borrower.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Book className="mr-3 text-blue-600" />
                Library Management
              </h1>
              <p className="text-gray-600 mt-1">Manage books, issues, and library operations</p>
            </div>
            <button
              onClick={handleAddBook}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Book
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
              <Book className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Books</p>
                <p className="text-2xl font-bold text-gray-900">{libraryStats.totalBooks}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Available</p>
                <p className="text-2xl font-bold text-green-600">{libraryStats.availableBooks}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Issued</p>
                <p className="text-2xl font-bold text-yellow-600">{libraryStats.issuedBooks}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{libraryStats.overdueBooks}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('books')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'books'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Books Catalog
              </button>
              <button
                onClick={() => setActiveTab('issues')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'issues'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Book Issues
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reports'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Reports
              </button>
            </nav>
          </div>

          {/* Search and Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={activeTab === 'books' ? "Search books by title, author, or ISBN..." : "Search issues..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {activeTab === 'books' && (
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    <option value="textbook">Textbook</option>
                    <option value="reference">Reference</option>
                    <option value="fiction">Fiction</option>
                    <option value="non-fiction">Non-Fiction</option>
                  </select>
                </div>
              )}

              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'books' && (
              <BooksTab 
                books={filteredBooks}
                loading={loading}
                onEdit={handleEditBook}
                onDelete={handleDeleteBook}
                onIssue={handleIssueBook}
              />
            )}

            {activeTab === 'issues' && (
              <IssuesTab 
                issues={filteredIssues}
                loading={loading}
                onReturn={handleReturnBook}
              />
            )}

            {activeTab === 'reports' && (
              <ReportsTab />
            )}
          </div>
        </div>

        {/* Add/Edit Book Modal */}
        {showAddModal && (
          <BookFormModal
            book={selectedBook}
            onClose={() => setShowAddModal(false)}
            onSave={() => {
              setShowAddModal(false);
              fetchLibraryData();
            }}
          />
        )}
      </div>
    </div>
  );
};

// Books Tab Component
const BooksTab = ({ books, loading, onEdit, onDelete, onIssue }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Book Details
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Availability
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
          {books.map((book) => (
            <tr key={book._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded bg-blue-100 flex items-center justify-center">
                      <Book className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {book.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      by {book.author} | ISBN: {book.isbn}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {book.bookId}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {book.category}
                </span>
                {book.subject && (
                  <div className="text-sm text-gray-500 mt-1">{book.subject}</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  Available: {book.copies.available}/{book.copies.total}
                </div>
                <div className="text-sm text-gray-500">
                  Issued: {book.copies.issued}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  book.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {book.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onIssue(book)}
                    disabled={book.copies.available === 0}
                    className="text-green-600 hover:text-green-900 p-1 rounded disabled:opacity-50"
                    title="Issue Book"
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>
                  <button
                    className="text-blue-600 hover:text-blue-900 p-1 rounded"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(book)}
                    className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                    title="Edit Book"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(book._id)}
                    className="text-red-600 hover:text-red-900 p-1 rounded"
                    title="Delete Book"
                  >
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
};

// Issues Tab Component
const IssuesTab = ({ issues, loading, onReturn }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Book Details
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Borrower
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Issue Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Due Date
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
          {issues.map((issue) => (
            <tr key={issue._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {issue.book.title}
                </div>
                <div className="text-sm text-gray-500">
                  ID: {issue.book.bookId}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{issue.borrower.name}</div>
                <div className="text-sm text-gray-500">{issue.borrower.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(issue.issueDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(issue.dueDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  issue.status === 'issued' 
                    ? 'bg-yellow-100 text-yellow-800'
                    : issue.status === 'overdue'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {issue.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {issue.status !== 'returned' && (
                  <button
                    onClick={() => onReturn(issue._id)}
                    className="text-green-600 hover:text-green-900"
                  >
                    Return Book
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Reports Tab Component
const ReportsTab = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Popular Books</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Introduction to Mathematics</span>
              <span className="text-sm font-medium">15 issues</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">English Literature</span>
              <span className="text-sm font-medium">12 issues</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Science Experiments</span>
              <span className="text-sm font-medium">8 issues</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Statistics</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Books Issued</span>
              <span className="text-sm font-medium">45</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Books Returned</span>
              <span className="text-sm font-medium">38</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Overdue Books</span>
              <span className="text-sm font-medium">7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Book Form Modal Component
const BookFormModal = ({ book, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: book?.title || '',
    author: book?.author || '',
    isbn: book?.isbn || '',
    publisher: book?.publisher || '',
    category: book?.category || 'textbook',
    subject: book?.subject || '',
    language: book?.language || 'English',
    pages: book?.pages || '',
    price: book?.price || '',
    copies: {
      total: book?.copies?.total || 1
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Mock save - replace with actual API call
      console.log('Saving book:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {book ? 'Edit Book' : 'Add New Book'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Author *</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ISBN</label>
                <input
                  type="text"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Publisher</label>
                <input
                  type="text"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="textbook">Textbook</option>
                  <option value="reference">Reference</option>
                  <option value="fiction">Fiction</option>
                  <option value="non-fiction">Non-Fiction</option>
                  <option value="journal">Journal</option>
                  <option value="magazine">Magazine</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Copies *</label>
                <input
                  type="number"
                  name="copies.total"
                  value={formData.copies.total}
                  onChange={handleInputChange}
                  min="1"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : (book ? 'Update' : 'Create')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LibraryManagement;