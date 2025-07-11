// App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Layout Components
import Layout from './components/Layout/Layout';


// Pages
import LoginPage from './pages/LoginPage';
import WelcomPage from './pages/WelcomPage';
import { LanguageProvider } from './components/languages/LanguageContext';

// Auth Context (optional)
interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { t, i18n } = useTranslation();

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem('isAuthenticated') === 'true';
      setIsAuthenticated(authStatus);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Replace with your actual authentication logic
      if (username === 'admin' && password === 'password') {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify({ username, role: 'admin' }));
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-neutral-600">{t('loading...')}</p>
        </div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-neutral-50">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  {/* <LoginPage onLogin={login} /> */}
                  <LoginPage />
                </PublicRoute>
              }
            />

            <Route
              path="/welcome"
              element={
                <PublicRoute>
                  <WelcomPage />
                </PublicRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <div className="p-6">
                      <h1 className="pos-title">Dashboard</h1>
                      <p className="mt-4 text-neutral-600">Welcome to POS System</p>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/pos"
              element={
                <ProtectedRoute>
                  <Layout>
                    <div className="p-6">
                      <h1 className="pos-title">POS Terminal</h1>
                      <p className="mt-4 text-neutral-600">Point of Sale Interface</p>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/menu"
              element={
                <ProtectedRoute>
                  <Layout>
                    <div className="p-6">
                      <h1 className="pos-title">Menu Management</h1>
                      <p className="mt-4 text-neutral-600">Manage your menu items</p>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Layout>
                    <div className="p-6">
                      <h1 className="pos-title">Orders</h1>
                      <p className="mt-4 text-neutral-600">View and manage orders</p>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/tables"
              element={
                <ProtectedRoute>
                  <Layout>
                    <div className="p-6">
                      <h1 className="pos-title">Table Management</h1>
                      <p className="mt-4 text-neutral-600">Manage restaurant tables</p>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Layout>
                    <div className="p-6">
                      <h1 className="pos-title">Reports</h1>
                      <p className="mt-4 text-neutral-600">Sales and analytics reports</p>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Layout>
                    <div className="p-6">
                      <h1 className="pos-title">Settings</h1>
                      <p className="mt-4 text-neutral-600">System configuration</p>
                    </div>
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Default redirects */}
            <Route
              path="/"
              element={
                isAuthenticated ?
                  <Navigate to="/dashboard" replace /> :
                  <Navigate to="/welcome" replace />
              }
            />

            {/* 404 Not Found */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-neutral-300">404</h1>
                    <p className="mt-4 text-xl text-neutral-600">Page not found</p>
                    <button
                      onClick={() => window.history.back()}
                      className="mt-6 btn-touch btn-primary"
                    >
                      Go Back
                    </button>
                  </div>
                </div>
              }
            />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;