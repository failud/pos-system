import axios from 'axios';
import { Modal } from 'antd';
import { getTokenFromCookies, removeAuthCookies } from './utils/auth';
// import { getTokenFromCookies, removeAuthCookies } from './utils/auth';


// Environment variable for API URL
const apiURL = import.meta.env.VITE_API_URL;

/**
 * Displays an error modal with customizable header and message
 * @param message - The error message to display
 * @param header - Optional header for the modal (defaults to 'Error')
 */
export function showErrorModal(message: string, header: string = 'Error') {
  Modal.error({
    title: header,
    content: message,
    okText: 'Close',
    centered: true,
  });
}

/**
 * Creates an axios instance with common configuration
 */
const apiClient = axios.create({
  baseURL: apiURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true, 
});

/**
 * Request interceptor for adding authorization token
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = getTokenFromCookies();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for handling errors and token expiration
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (true) {
        case data.error === 'Package expired':
          showErrorModal('Package expired');
          break;
        case data.error === 'End date not found':
          showErrorModal('Your payment is waiting for approval. Please try again later');
          break;
        case status === 401:
          // Token expired or invalid
          removeAuthCookies();
          showErrorModal('Session expired. Please login again.', 'Unauthorized');
          
          // Redirect to login after a short delay
          setTimeout(() => {
            window.location.href = '/welcome';
          }, 1500);
          break;
        case status === 403:
          showErrorModal('Access denied. You don\'t have permission to access this resource.', 'Forbidden');
          break;
        case status === 404:
          const message = data.message || 'The requested resource was not found. Please try again later';
          showErrorModal(message, 'Not Found');
          break;
        case status >= 500:
          showErrorModal('Server error. Please try again later.', 'Server Error');
          break;
        default:
          showErrorModal(data.message || 'An unexpected error occurred', 'Error');
      }
    } else if (error.request) {
      showErrorModal('Network error. Please check your connection.', 'Network Error');
    } else {
      showErrorModal('Request error. Please try again.', 'Error');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
