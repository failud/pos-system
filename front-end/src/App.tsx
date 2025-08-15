// App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomPage from './pages/WelcomPage';
import { LanguageProvider } from './components/languages/LanguageContext';
import Dashboard from './pages/Dashboard';
import SalePage from './pages/SalePage';
import ProductPage from './pages/ProductPage';
import Page404 from './pages/Page404';
import CategoyPage from './pages/CategoyPage';
import BrandPage from './pages/BrandPage';
import UserPgae from './pages/UserPgae';
import CustomerPage from './pages/CustomerPage';


function App() {

  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-neutral-50">
          <Routes>
            <Route
              path="/"
              element={<WelcomPage />}
            />

            <Route
              path="/welcome"
              element={<WelcomPage />}
            />

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/categories"
              element={<CategoyPage />}
            />

            <Route
              path="/products"
              element={<ProductPage />}
            />

            <Route
              path="/brands"
              element={<BrandPage />}
            />

            <Route
              path="/sales"
              element={<SalePage />}
            />
            
            <Route
              path="/users"
              element={<UserPgae />}
            />

            <Route
              path="/customers"
              element={<CustomerPage />}
            />

            {/* 404 Not Found */}
            <Route
              path="*"
              element={
                <Page404 />
              }
            />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;