import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Loader, AlertCircle } from 'lucide-react';

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
  role: 'USER' | 'ADMIN' | 'VENDEUR';
}

const AdminDashboard: React.FC = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<'cars' | 'rentals' | 'users' | 'images'>('cars');
  const [cars, setCars] = useState<Car[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        let response;
        if (activeTab === 'cars') {
          response = await axios.get('/api/cars');
          setCars(response.data);
        } else if (activeTab === 'rentals') {
          response = await axios.get('/api/rentals', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setRentals(response.data);
        } else if (activeTab === 'users') {
          response = await axios.get('/api/users', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUsers(response.data);
        } else if (activeTab === 'images') {
          response = await axios.get('/api/uploads', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setImages(response.data); 
        }
      } catch (err) {
        setError(`Impossible de récupérer les données (${activeTab}).`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab, token]);

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    try {
      await axios.delete(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    } catch (err) {
      alert("Une erreur est survenue lors de la suppression.");
      console.error(err);
    }
  };

  const handleDeleteCar = async (carId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette voiture ?')) return;
    try {
      await axios.delete(`/api/cars/${carId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCars(prevCars => prevCars.filter(car => car.id !== carId));
    } catch (err) {
      alert("Erreur lors de la suppression de la voiture.");
      console.error(err);
    }
  };

  const handleDeleteRental = async (rentalId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette location ?')) return;
    try {
      await axios.delete(`/api/rentals/${rentalId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRentals(prevRentals => prevRentals.filter(rental => rental.id !== rentalId));
    } catch (err) {
      alert("Erreur lors de la suppression de la location.");
      console.error(err);
    }
  };

  const handleChangeUserRole = async (userId: number, newRole: 'USER' | 'ADMIN' | 'VENDEUR') => {
    try {
      await axios.put(`/api/users/${userId}`, 
        { role: newRole }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert("Erreur lors de la mise à jour du rôle.");
      console.error(err);
    }
  };

  const handleDeleteImage = async (filename: string) => {
    if (!window.confirm('Supprimer cette image ?')) return;
    try {
      await axios.delete(`/api/uploads/${filename}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setImages(prev => prev.filter(img => img !== filename));
    } catch (err) {
      alert("Erreur lors de la suppression de l'image.");
      console.error(err);
    }
  };
  

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
            <button onClick={() => setActiveTab('images')} className={`py-4 px-6 font-medium text-sm border-b-2 focus:outline-none ${activeTab === 'images' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Gestion des Images</button>
          </nav>
        </div>

        {error && (
          <div className="p-4 bg-red-100 text-red-600 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" /> {error}
          </div>
        )}

        <div className="p-6">
          {activeTab === 'cars' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Liste des voitures</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map(car => (
                  <div key={car.id} className="bg-gray-100 rounded-lg shadow p-4">
                    <img src={car.imageUrl.startsWith('/uploads/')
                        ? `${car.imageUrl}`
                        : car.imageUrl}
                      alt={`${car.brand} ${car.model}`} className="w-full h-48 object-cover rounded-md mb-4" />
                    <h3 className="text-xl font-semibold">{car.brand} {car.model}</h3>
                    <p className="text-sm text-gray-600">Année : {car.year}</p>
                    <p className="text-sm text-gray-600">Couleur : {car.color}</p>
                    <p className="text-sm text-gray-600">Prix : {car.price} €</p>
                    <p className="text-sm text-gray-600 mb-2">Disponible : {car.available ? 'Oui' : 'Non'}</p>
                    <p className="text-sm text-gray-800">{car.description}</p>
                    <button
                      onClick={() => handleDeleteCar(car.id)}
                      className="mt-3 bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm rounded"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'rentals' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Liste des locations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rentals.map(rental => (
                  <div key={rental.id} className="bg-gray-100 rounded-lg shadow p-4">
                    <div className="mb-2">
                      <h3 className="text-xl font-semibold mb-1">
                        {rental.car.brand} {rental.car.model} ({rental.car.year})
                      </h3>
                      <p className="text-sm text-gray-600">Client : {rental.user.name} ({rental.user.email})</p>
                    </div>
                    <p className="text-sm text-gray-600">Du : {new Date(rental.startDate).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">Au : {new Date(rental.endDate).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">Prix total : {rental.totalPrice} €</p>
                    <p className={`text-sm font-medium mt-2 ${rental.status === 'confirmed' ? 'text-green-600' : rental.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>
                      Statut : {rental.status}
                    </p>
                    <button
                      onClick={() => handleDeleteRental(rental.id)}
                      className="mt-3 bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm rounded"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Liste des utilisateurs</h2>
              <ul>
                {users.map(user => (
                  <li key={user.id} className="border-b py-2 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                    <div>
                      <div>{user.name} - {user.email}</div>
                      <div className="text-sm text-gray-600">Rôle actuel : <strong>{user.role}</strong></div>
                    </div>

                    <div className="flex items-center gap-3">
                    <select
                        value={user.role}
                        onChange={(e) => handleChangeUserRole(user.id, e.target.value as 'USER' | 'ADMIN' | 'VENDEUR')}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="USER">USER</option>
                        <option value="VENDEUR">VENDEUR</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm rounded"
                      >
                        Supprimer
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'images' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Images Uploadées</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map(filename => (
                  <div key={filename} className="bg-gray-100 rounded-lg shadow p-2 flex flex-col items-center">
                    <img
                      src={`/uploads/${filename}`}
                      alt={filename}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                    <div className="text-xs break-all mb-1">{filename}</div>
                    <button
                      onClick={() => handleDeleteImage(filename)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs rounded"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
