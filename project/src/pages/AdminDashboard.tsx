import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Car as CarIcon, Users, Calendar, DollarSign, Loader, AlertCircle, Check, X } from 'lucide-react';

interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  color: string;
  price: number;
  description: string;
  imageUrl: string;
  available: boolean;
}

interface Rental {
  id: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  car: Car;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

interface User {
  id: number;
  name: string;
  email: string;
}

const AdminDashboard: React.FC = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<'cars' | 'rentals' | 'users'>('cars');
  const [cars, setCars] = useState<Car[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddCarForm, setShowAddCarForm] = useState<boolean>(false);
  const [newCar, setNewCar] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    price: 0,
    description: '',
    imageUrl: ''
  });
  const [addCarSuccess, setAddCarSuccess] = useState<boolean>(false);
  const [addCarError, setAddCarError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        let response;
        if (activeTab === 'cars') {
          response = await axios.get('http://localhost:5000/api/cars');
          setCars(response.data);
        } else if (activeTab === 'rentals') {
          response = await axios.get('http://localhost:5000/api/rentals', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setRentals(response.data);
        } else {
          response = await axios.get('http://localhost:5000/api/users', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUsers(response.data);
        }
      } catch (err) {
        setError(`Impossible de récupérer les données (${activeTab}).`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Chargement des données...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Tableau de Bord Admin</h1>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button onClick={() => setActiveTab('cars')} className={`py-4 px-6 font-medium text-sm border-b-2 focus:outline-none ${activeTab === 'cars' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Gestion des Voitures</button>
            <button onClick={() => setActiveTab('rentals')} className={`py-4 px-6 font-medium text-sm border-b-2 focus:outline-none ${activeTab === 'rentals' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Gestion des Locations</button>
            <button onClick={() => setActiveTab('users')} className={`py-4 px-6 font-medium text-sm border-b-2 focus:outline-none ${activeTab === 'users' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Gestion des Utilisateurs</button>
          </nav>
        </div>

        {error && (
          <div className="p-4 bg-red-100 text-red-600 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" /> {error}
          </div>
        )}

        <div className="p-6">
          {activeTab === 'cars' && <div>Affichage des voitures...</div>}
          {activeTab === 'rentals' && <div>Affichage des locations...</div>}
          {activeTab === 'users' && (
            <div>
              <h2 className="text-lg font-semibold">Liste des utilisateurs</h2>
              <ul>
                {users.map(user => (
                  <li key={user.id} className="border-b py-2">{user.name} - {user.email}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;