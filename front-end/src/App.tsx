// App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomPage from './pages/WelcomPage';
import { LanguageProvider } from './components/languages/LanguageContext';
import Dashboard from './pages/Dashboard';
import SalePage from './pages/SalePage';
import ProductPage from './pages/ProductPage';
import Page404 from './pages/Page404';


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
              path="/products"
              element={<ProductPage />}
            />

            <Route
              path="/sales"
              element={<SalePage />}
            />


            {/* 404 Not Found */}
            <Route
              path="*"
              element={
                <Page404/>
              }
            />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;