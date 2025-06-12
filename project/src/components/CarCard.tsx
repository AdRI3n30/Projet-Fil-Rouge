import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar} from 'lucide-react';

interface CarCardProps {
  car: {
    id: number;
    brand: string;
    model: string;
    year: number;
    color: string;
    price: number;
    imageUrl: string;
    available: boolean;
  };
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
      <img 
        src={car.imageUrl.startsWith('/uploads/')
          ? `${car.imageUrl}`
          : car.imageUrl}
        alt={`${car.brand} ${car.model}`} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-800">{car.brand} {car.model}</h3>
        </div>
        <div className="mt-2 flex items-center text-gray-600">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{car.year}</span>
          <span className="mx-2">•</span>
          <span>Couleur: {car.color}</span>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center text-blue-600 font-bold">
            <span>{car.price}€ / jour</span>
          </div>
          <Link 
            to={`/cars/${car.id}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Détails
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;