import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CarsPage from './pages/CarsPage';
import CarDetailsPage from './pages/CarDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import VendeurPage from './pages/VendeurPage';
import AddCarPage from './pages/AddCar';
import EditCarPage from './pages/EditCar';
import BillingPage from './pages/BillingPage';
import MesReservations from './pages/MesReservations';
import CompanyMap from './pages/CompanyMap';
import React from 'react';
import VendeurRoute from './components/VendeurRoute'; 


function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow pt-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/cars" element={<CarsPage />} />
              <Route path="/cars/:id" element={<CarDetailsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route 
                path="/edit-car/:id" 
                element={
                  <VendeurRoute>
                    <EditCarPage />
                  </VendeurRoute>
                } 
              />
              <Route 
                path="/vendeur" 
                element={
                  <VendeurRoute>
                    <VendeurPage />
                  </VendeurRoute>
                }
              />
              <Route 
                path="/ajouter-voiture" 
                element={
                  <VendeurRoute>
                    <AddCarPage />
                  </VendeurRoute>
                }
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
              <Route path="/facturation" element={<BillingPage />} />
              <Route path="/mes-reservations" element={<MesReservations />} />
              <Route path="/implantations" element={<CompanyMap />} />
              <Route path="*" element={<Navigate to="/" replace />} /> {/* Redirection pour les routes inconnues */}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;