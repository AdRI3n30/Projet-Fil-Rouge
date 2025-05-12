import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Pencil, Trash2, PlusCircle, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CarItem {
  id: number;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  imageUrl: string;
}

const VendeurPage: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [cars, setCars] = useState<CarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/cars', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCars(response.data);
    } catch (err: any) {
      setError("Erreur lors du chargement des voitures.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleDelete = async (carId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette voiture ?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/cars/${carId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCars(prev => prev.filter(car => car.id !== carId));
    } catch (err) {
      alert("Erreur lors de la suppression.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mes Voitures en Vente</h1>
        <button
          onClick={() => navigate('/ajouter-voiture')}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Ajouter une voiture
        </button>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : cars.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Aucune voiture trouvée. Cliquez sur "Ajouter une voiture" pour commencer.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div key={car.id} className="bg-white rounded-lg shadow p-4 flex flex-col">
              <img src={car.imageUrl} alt={`${car.brand} ${car.model}`} className="h-40 w-full object-cover rounded mb-4" />
              <h2 className="text-lg font-semibold text-gray-800">{car.brand} {car.model} ({car.year})</h2>
              <p className="text-blue-600 font-bold">{car.pricePerDay}€ / jour</p>
              <div className="mt-auto flex justify-end space-x-2 pt-4">
                <button
                  onClick={() => navigate(`/modifier-voiture/${car.id}`)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Pencil className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(car.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendeurPage;
