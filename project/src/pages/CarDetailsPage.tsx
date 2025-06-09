import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, DollarSign, Check, X, Loader, Car as CarIcon } from 'lucide-react';

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

const CarDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [totalDays, setTotalDays] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isRenting, setIsRenting] = useState<boolean>(false);
  const [rentalSuccess, setRentalSuccess] = useState<boolean>(false);
  const [rentalError, setRentalError] = useState<string | null>(null);
  const [reservedPeriods, setReservedPeriods] = useState<{startDate: string, endDate: string}[]>([]);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/cars/${id}`);
        setCar(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Une erreur est survenue lors de la récupération des détails de la voiture');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      setTotalDays(diffDays);
      if (car) {
        setTotalPrice(diffDays * car.price);
      }
    }
  }, [startDate, endDate, car]);

  // Récupère les périodes réservées pour cette voiture
  useEffect(() => {
    const fetchReservedPeriods = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/rentals', {
          params: { carId: id },
          headers: { Authorization: `Bearer ${token}` }
        });
        // Filtre les locations PENDING ou CONFIRMED
        const periods = res.data
          .filter((r: any) => (r.carId === Number(id)) && (r.status === 'PENDING' || r.status === 'CONFIRMED'))
          .map((r: any) => ({ startDate: r.startDate, endDate: r.endDate }));
        setReservedPeriods(periods);
      } catch {}
    };
    if (id) fetchReservedPeriods();
  }, [id, token]);

  // Vérifie si la période choisie chevauche une période réservée
  const isPeriodUnavailable = () => {
    if (!startDate || !endDate) return false;
    const start = new Date(startDate);
    const end = new Date(endDate);
    // On considère la date de fin comme exclusive pour permettre une nouvelle réservation à partir de ce jour
    return reservedPeriods.some(period => {
      const reservedStart = new Date(period.startDate);
      const reservedEnd = new Date(period.endDate);
      // La période est indisponible si l'intervalle [start, end) chevauche [reservedStart, reservedEnd)
      return (
        start < reservedEnd && end > reservedStart
      );
    });
  };

  const handleRent = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!startDate || !endDate) {
      setRentalError('Veuillez sélectionner les dates de location');
      return;
    }

    try {
      setIsRenting(true);
      setRentalError(null);

      const response = await axios.post(
        'http://localhost:5000/api/rentals',
        {
          carId: car?.id,
          startDate,
          endDate,
          totalPrice
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Redirige vers la page de facturation avec les infos de la commande et de la voiture
      navigate('/facturation', { state: { rental: response.data, car } });

    } catch (err: any) {
      setRentalError(err.response?.data?.message || 'Une erreur est survenue lors de la location');
    } finally {
      setIsRenting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Chargement des détails...</span>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erreur!</strong>
          <span className="block sm:inline"> {error || 'Voiture non trouvée'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img 
              src={car.imageUrl.startsWith('/uploads/')
                ? `http://localhost:5000${car.imageUrl}`
                : car.imageUrl}
              alt={`${car.brand} ${car.model}`} 
              className="w-full h-96 object-cover"
            />
          </div>
          <div className="md:w-1/2 p-8">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-gray-800">{car.brand} {car.model}</h1>
              <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                Disponible
              </span>
            </div>
            
            <div className="mt-4 flex items-center text-gray-600">
              <Calendar className="h-5 w-5 mr-2" />
              <span className="text-lg">{car.year}</span>
              <span className="mx-3">•</span>
              <span className="text-lg">Couleur: {car.color}</span>
            </div>
            
            <div className="mt-6 flex items-center text-blue-600 font-bold text-2xl">
              <DollarSign className="h-6 w-6" />
              <span>{car.price}€ / jour</span>
            </div>
            
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600">{car.description}</p>
            </div>
            
            {/* Affichage de la section réservation toujours, même si car.available est false */}
            <div className="mt-8 border-t pt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Réserver cette voiture</h3>
              
              {/* Affichage des périodes réservées */}
              {reservedPeriods.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-1">Périodes déjà réservées :</div>
                  <ul className="text-sm text-gray-600 list-disc ml-5">
                    {reservedPeriods.map((p, idx) => (
                      <li key={idx}>
                        {new Date(p.startDate).toLocaleDateString()} au {new Date(p.endDate).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {rentalSuccess ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 mr-2" />
                    <span>Votre réservation a été effectuée avec succès!</span>
                  </div>
                </div>
              ) : (
                <>
                  {rentalError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                      <div className="flex items-center">
                        <X className="h-5 w-5 mr-2" />
                        <span>{rentalError}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Date de début
                      </label>
                      <input
                        type="date"
                        id="startDate"
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Date de fin
                      </label>
                      <input
                        type="date"
                        id="endDate"
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                  
                  {totalDays > 0 && (
                    <div className="bg-gray-50 p-4 rounded-md mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Durée de location:</span>
                        <span className="font-medium">{totalDays} jour{totalDays > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>{totalPrice}€</span>
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={handleRent}
                    disabled={isRenting || isPeriodUnavailable()}
                    className={`w-full py-3 px-4 rounded-md font-medium text-white flex items-center justify-center
                      ${isRenting || isPeriodUnavailable() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    {isRenting ? (
                      <>
                        <Loader className="animate-spin h-5 w-5 mr-2" />
                        Traitement en cours...
                      </>
                    ) : (
                      <>
                        <CarIcon className="h-5 w-5 mr-2" />
                        {isPeriodUnavailable()
                          ? 'Période indisponible'
                          : isAuthenticated ? 'Réserver maintenant' : 'Connectez-vous pour réserver'}
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsPage;