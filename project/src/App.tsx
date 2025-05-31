import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <AuthProvider>
      <Router>
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
                  <ProtectedRoute>
                    <EditCarPage />
                  </ProtectedRoute>
                } />
              <Route 
                path="/vendeur" 
                element={
                  <ProtectedRoute>
                    <VendeurPage />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/ajouter-voiture" 
                element={
                  <ProtectedRoute>
                    <AddCarPage />
                  </ProtectedRoute>
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
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;