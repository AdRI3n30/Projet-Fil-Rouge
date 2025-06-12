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
  price: number;
  imageUrl: string;
}

const VendeurPage: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [cars, setCars] = useState<CarItem[]>([]);
  const [rentals, setRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<'brand' | 'model' | 'year' | 'price'>('brand');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/cars', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCars(response.data);
    } catch (err: any) {
      setError("Erreur lors du chargement des voitures.");
    } finally {
      setLoading(false);
    }
  };

  const isCarRented = (carId: number) => {
    return rentals.some(
      rental =>
        rental.carId === carId &&
        (rental.status === "PENDING" || rental.status === "CONFIRMED")
    );
  };

  const handleRentalAction = async (rentalId: number, action: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'FINISHED') => {
    try {
      await axios.put(
        `/api/rentals/${rentalId}`,
        { status: action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const res = await axios.get('/api/rentals', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRentals(res.data);
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      alert("Erreur lors de la mise à jour de la commande.");
    }
  };

  const handleDeleteRental = async (rentalId: number) => {
    const confirmation = window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?');
    if (!confirmation) return;

    try {
      await axios.delete(`/api/rentals/${rentalId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRentals(prev => prev.filter(r => r.id !== rentalId));
    } catch (err: any) {
      alert("Erreur lors de la suppression de la commande.");
    }
  };

  useEffect(() => {
    fetchCars();
    axios.get('/api/rentals', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setRentals(res.data))
      .catch(() => setRentals([]));
  }, []);

  const handleDelete = async (carId: number) => {
    const confirmation = window.confirm('Êtes-vous sûr de vouloir supprimer cette voiture ?');
    if (!confirmation) return;

    try {
      await axios.delete(`/api/cars/${carId}`);
      setCars(prevCars => prevCars.filter(car => car.id !== carId));
    } catch (err: any) {
      console.error('Erreur lors de la suppression :', err);
      alert(err.response?.data?.message || "Erreur lors de la suppression de la voiture.");
    }
  };

  const sortedCars = [...cars].sort((a, b) => {
    let valA = a[sortKey];
    let valB = b[sortKey];
    if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = (valB as string).toLowerCase();
    }
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Section Mes Voitures */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-12 p-6">
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
          <>
            <div className="flex items-center mb-4 gap-4">
              <label className="font-medium">Trier par :</label>
              <select
                value={sortKey}
                onChange={e => setSortKey(e.target.value as any)}
                className="border rounded px-2 py-1"
              >
                <option value="brand">Marque</option>
                <option value="model">Modèle</option>
                <option value="year">Année</option>
                <option value="price">Prix</option>
              </select>
              <button
                onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
                className="border rounded px-2 py-1"
                title={sortOrder === 'asc' ? 'Ordre croissant' : 'Ordre décroissant'}
              >
                {sortOrder === 'asc' ? '⬆️' : '⬇️'}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCars.map((car) => (
                <div key={car.id} className="bg-white rounded-lg shadow p-4 flex flex-col relative">
                  {isCarRented(car.id) && (
                    <span className="absolute top-2 right-2 bg-yellow-400 text-white text-xs px-2 py-1 rounded">
                      En commande
                    </span>
                  )}
                  <img src={car.imageUrl.startsWith('/uploads/')? `${car.imageUrl}`: car.imageUrl} alt={`${car.brand} ${car.model}`}  className="h-40 w-full object-cover rounded mb-4" />
                  <h2 className="text-lg font-semibold text-gray-800">{car.brand} {car.model} ({car.year})</h2>
                  <p className="text-blue-600 font-bold">{car.price}€ / jour</p>
                  <div className="mt-auto flex justify-end space-x-2 pt-4">
                    <button
                      onClick={() => navigate(`/edit-car/${car.id}`)}
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
          </>
        )}
      </div>

      {/* Section Commandes à suivre */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Commandes à suivre</h2>
        {rentals.filter(r => r.status !== "CANCELLED" && r.status !== "COMPLETED").length === 0 ? (
          <p className="text-gray-500">Aucune commande à suivre.</p>
        ) : (
          <div className="space-y-4">
            {rentals
              .filter(r => r.status !== "CANCELLED" && r.status !== "COMPLETED")
              .map(rental => (
                <div key={rental.id} className="bg-gray-50 rounded shadow p-4 flex flex-col sm:flex-row sm:items-center justify-between">
                  <div>
                    <div className="font-bold">{rental.car.brand} {rental.car.model} ({rental.car.year})</div>
                    <div className="text-sm text-gray-600">
                      Du {new Date(rental.startDate).toLocaleDateString()} au {new Date(rental.endDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      Client : {rental.user.name} ({rental.user.email})
                    </div>
                    <div className="text-sm text-gray-600">Prix total : {rental.totalPrice} €</div>
                    <div className="text-xs mt-1 px-2 py-1 inline-block rounded bg-blue-100 text-blue-700 font-semibold">
                      Statut : {rental.status}
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4 sm:mt-0">
                    {rental.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => handleRentalAction(rental.id, 'CONFIRMED')}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Accepter
                        </button>
                        <button
                          onClick={() => handleRentalAction(rental.id, 'CANCELLED')}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Refuser
                        </button>
                      </>
                    )}
                    {rental.status === "CONFIRMED" && (
                      <button
                        onClick={() => handleRentalAction(rental.id, 'COMPLETED')}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Finir la location
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteRental(rental.id)}
                      className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendeurPage;
