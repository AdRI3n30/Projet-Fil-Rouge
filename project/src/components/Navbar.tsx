import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Car, Menu, X, ShoppingCart } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';

const Navbar: React.FC = () => {
  const { isAuthenticated, isAdmin, isSeller, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState<number>(0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  React.useEffect(() => {
    const fetchPending = async () => {
      if (isSeller && isAuthenticated) {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get('http://localhost:5000/api/rentals', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const count = res.data.filter((r: any) => r.status === 'PENDING').length;
          setPendingCount(count);
        } catch {
          setPendingCount(0);
        }
      }
    };
    fetchPending();
    // Ajout d'un écouteur d'événement pour rafraîchir le compteur sur demande
    const handler = () => fetchPending();
    window.addEventListener('refreshPending', handler);
    // Ajout d'un polling toutes les 5 secondes (au lieu de 15)
    const interval = setInterval(fetchPending, 5000);
    return () => {
      window.removeEventListener('refreshPending', handler);
      clearInterval(interval);
    };
  }, [isSeller, isAuthenticated]);

  return (
    <nav className="bg-blue-600 text-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Car className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl">AutoLoc</span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                Accueil
              </Link>
              <Link to="/cars" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                Nos Voitures
              </Link>
            </div>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                    Admin
                  </Link>
                )}
                {isSeller && (
                  <div className="relative">
                    <Link to="/vendeur" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                      Vendeur
                    </Link>
                    {pendingCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2 py-0.5 animate-bounce">
                        {pendingCount}
                      </span>
                    )}
                  </div>
                )}
                <Link to="/mes-reservations" className="relative px-3 py-2 rounded-md hover:bg-blue-700 flex items-center">
                  <ShoppingCart className="h-6 w-6" />
                </Link>
                <Link to="/profile" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                  Mon Profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 rounded-md text-sm font-medium bg-white text-blue-600 hover:bg-gray-100"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile avec animation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-600"
          >
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link
              to="/cars"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Nos Voitures
            </Link>
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                {isSeller && (
                  <Link
                    to="/vendeur"
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Vendeur
                  </Link>
                )}
                <Link
                  to="/mes-reservations"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mes Réservations
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mon Profil
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-red-600 hover:bg-red-700"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-white text-blue-600 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Inscription
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
