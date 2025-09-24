import axios from 'axios';
import API_ENDPOINTS from '../config/api.js';

class LibraryService {
  // BOOK MANAGEMENT

  // Get all books with filtering and pagination
  async getBooks(params = {}) {
    try {
      const response = await axios.get(API_ENDPOINTS.library.books, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get book by ID
  async getBookById(id) {
    try {
      const response = await axios.get(`${API_ENDPOINTS.library.books}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Add new book
  async addBook(bookData) {
    try {
      const response = await axios.post(API_ENDPOINTS.library.books, bookData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update book
  async updateBook(id, bookData) {
    try {
      const response = await axios.put(`${API_ENDPOINTS.library.books}/${id}`, bookData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete book
  async deleteBook(id) {
    try {
      const response = await axios.delete(`${API_ENDPOINTS.library.books}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // BOOK ISSUE/RETURN MANAGEMENT

  // Get all book issues
  async getBookIssues(params = {}) {
    try {
      const response = await axios.get(API_ENDPOINTS.library.issues, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Issue book
  async issueBook(issueData) {
    try {
      const response = await axios.post(API_ENDPOINTS.library.issue, issueData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Return book
  async returnBook(issueId, returnData = {}) {
    try {
      const response = await axios.post(API_ENDPOINTS.library.return(issueId), returnData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Renew book
  async renewBook(issueId) {
    try {
      const response = await axios.post(API_ENDPOINTS.library.renew(issueId));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get overdue books
  async getOverdueBooks() {
    try {
      const response = await axios.get(API_ENDPOINTS.library.overdue);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // LIBRARY SETTINGS

  // Get library settings
  async getLibrarySettings() {
    try {
      const response = await axios.get(API_ENDPOINTS.library.settings);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update library settings
  async updateLibrarySettings(settings) {
    try {
      const response = await axios.put(API_ENDPOINTS.library.settings, settings);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // REPORTS AND ANALYTICS

  // Get library statistics
  async getLibraryStatistics() {
    try {
      const response = await axios.get(API_ENDPOINTS.library.statistics);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Generate library reports
  async generateReport(reportType, params = {}) {
    try {
      const response = await axios.get(`${API_ENDPOINTS.library.books}/reports`, {
        params: { reportType, ...params }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // SEARCH AND FILTERS

  // Search books
  async searchBooks(query, filters = {}) {
    try {
      const params = { search: query, ...filters };
      const response = await axios.get(API_ENDPOINTS.library.books, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get books by category
  async getBooksByCategory(category) {
    try {
      const response = await axios.get(API_ENDPOINTS.library.books, {
        params: { category }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get books by subject
  async getBooksBySubject(subject) {
    try {
      const response = await axios.get(API_ENDPOINTS.library.books, {
        params: { subject }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // UTILITY METHODS

  // Check book availability
  async checkBookAvailability(bookId) {
    try {
      const response = await axios.get(`${API_ENDPOINTS.library.books}/${bookId}`);
      const book = response.data.data;
      return {
        available: book.copies.available > 0,
        availableCopies: book.copies.available,
        totalCopies: book.copies.total
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get user's issued books
  async getUserIssuedBooks(userId) {
    try {
      const response = await axios.get(API_ENDPOINTS.library.issues, {
        params: { borrower: userId, status: 'issued' }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Calculate fine for overdue book
  calculateFine(dueDate, returnDate = new Date(), finePerDay = 1) {
    const due = new Date(dueDate);
    const returned = new Date(returnDate);
    
    if (returned <= due) return 0;
    
    const overdueDays = Math.ceil((returned - due) / (1000 * 60 * 60 * 24));
    return overdueDays * finePerDay;
  }

  // Format book data for display
  formatBookData(book) {
    return {
      ...book,
      availabilityStatus: book.copies.available > 0 ? 'Available' : 'Not Available',
      availabilityColor: book.copies.available > 0 ? 'green' : 'red',
      utilizationRate: Math.round((book.copies.issued / book.copies.total) * 100)
    };
  }

  // Handle API errors
  handleError(error) {
    if (error.response) {
      return {
        message: error.response.data.message || 'An error occurred',
        status: error.response.status,
        errors: error.response.data.errors || []
      };
    } else if (error.request) {
      return {
        message: 'Network error - please check your connection',
        status: 0
      };
    } else {
      return {
        message: error.message || 'An unexpected error occurred',
        status: 0
      };
    }
  }
}

export default new LibraryService();