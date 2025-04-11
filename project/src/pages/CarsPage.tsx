import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CarCard from '../components/CarCard';
import { Search, Filter, Loader } from 'lucide-react';

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

const CarsPage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<number>(500);
  const [selectedBrand, setSelectedBrand] = useState<string>('');

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/cars');
        console.log('Données récupérées :', response.data);
        setCars(response.data);
        setFilteredCars(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Une erreur est survenue lors de la récupération des voitures');
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  useEffect(() => {
    let result = cars;

    // Filter by search term
    if (searchTerm) {
      result = result.filter(car => 
        car.brand.toLowerCase().includes(searchTerm.toLowerCase()) || 
        car.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by availability
    if (showOnlyAvailable) {
      result = result.filter(car => car.available);
    }

    // Filter by price
    result = result.filter(car => car.price <= priceRange);

    // Filter by brand
    if (selectedBrand) {
      result = result.filter(car => car.brand === selectedBrand);
    }

    setFilteredCars(result);
  }, [searchTerm, showOnlyAvailable, priceRange, selectedBrand, cars]);

  // Get unique brands for filter
  const brands = [...new Set(cars.map(car => car.brand))];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Chargement des voitures...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erreur!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Nos Voitures</h1>
      
      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher par marque ou modèle..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="available"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={showOnlyAvailable}
              onChange={(e) => setShowOnlyAvailable(e.target.checked)}
            />
            <label htmlFor="available" className="ml-2 text-gray-700">
              Afficher uniquement les voitures disponibles
            </label>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 mb-1">
              Prix maximum: {priceRange}€ / jour
            </label>
            <input
              type="range"
              id="priceRange"
              min="50"
              max="100000"
              step="10"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              value={priceRange}
              onChange={(e) => setPriceRange(parseInt(e.target.value))}
            />
          </div>
          
          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
              Marque
            </label>
            <select
              id="brand"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value="">Toutes les marques</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Results */}
      {filteredCars.length === 0 ? (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-800 mb-2">Aucune voiture trouvée</h3>
          <p className="text-gray-600">Essayez de modifier vos filtres pour voir plus de résultats.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CarsPage;