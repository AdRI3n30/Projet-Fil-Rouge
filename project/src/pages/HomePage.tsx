import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, Shield, Clock, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import video from '/Vidéo/Hero.mp4'

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [popularCars, setPopularCars] = useState<any[]>([]);

  useEffect(() => {
    const fetchPopularCars = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/cars');
        const sorted = [...res.data].sort((a, b) => b.timesRented - a.timesRented).slice(0, 3);
        setPopularCars(sorted);
      } catch (err) {
        setPopularCars([]);
      }
    };
    fetchPopularCars();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section avec animation de fade-in */}
      <section 
        className="relative h-screen animate-fade-in"
      >
        <video 
          className="absolute inset-0 w-full h-full object-cover" 
          src= {video}
          autoPlay 
          loop 
          muted 
          playsInline
        />
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-slide-up">
            Louez la voiture de vos rêves
          </h1>
          <p className="text-xl text-white mb-8 max-w-2xl animate-slide-up delay-200">
            Découvrez notre sélection de véhicules premium à des prix compétitifs. Réservez en quelques clics et prenez la route en toute liberté.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up delay-300">
            <Link 
              to="/cars" 
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Voir nos voitures
            </Link>
            {!isAuthenticated ? (
              <Link 
                to="/register" 
                className="px-6 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                S'inscrire
              </Link>
            ) : (
              <Link 
                to="/profile" 
                className="px-6 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Mon Profil
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section avec animation au scroll */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 animate-fade-in">Pourquoi nous choisir ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl animate-slide-up">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-4 animate-bounce-slow">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Large sélection</h3>
              <p className="text-gray-600">Des centaines de modèles disponibles pour tous les goûts et tous les budgets.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl animate-slide-up delay-100">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-4 animate-bounce-slow">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Assurance complète</h3>
              <p className="text-gray-600">Tous nos véhicules sont couverts par une assurance tous risques pour votre tranquillité.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl animate-slide-up delay-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-4 animate-bounce-slow">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Service 24/7</h3>
              <p className="text-gray-600">Notre équipe est disponible à tout moment pour vous assister en cas de besoin.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl animate-slide-up delay-300">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-4 animate-bounce-slow">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Plusieurs agences</h3>
              <p className="text-gray-600">Récupérez et déposez votre véhicule dans l'une de nos nombreuses agences.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Cars Section avec animations */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 animate-fade-in">Nos voitures populaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularCars.length === 0 ? (
              <p className="col-span-3 text-center text-gray-500">Aucune voiture populaire pour le moment.</p>
            ) : (
              popularCars.map((car, idx) => (
                <div
                  key={car.id}
                  className={`bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-xl animate-slide-up${idx === 1 ? ' delay-100' : idx === 2 ? ' delay-200' : ''}`}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={car.imageUrl.startsWith('/uploads/')
                        ? `http://localhost:5000${car.imageUrl}`
                        : car.imageUrl}
                      alt={`${car.brand} ${car.model}`} 
                      className="w-full h-48 object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      {car.timesRented} location{car.timesRented > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-800">{car.brand} {car.model}</h3>
                    <p className="text-gray-600 mt-2">{car.description}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-blue-600 font-bold">{car.price}€ / jour</span>
                      <Link
                        to={`/cars/${car.id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      >
                        Voir plus
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/cars"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg inline-block animate-bounce-slow"
            >
              Voir toutes nos voitures
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section avec animations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 animate-fade-in">Ce que disent nos clients</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 hover:shadow-xl animate-slide-up">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl animate-bounce-slow">
                  S
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Sophie Martin</h4>
                  <div className="flex text-yellow-400">
                    <span className="animate-pulse">★</span>
                    <span className="animate-pulse delay-100">★</span>
                    <span className="animate-pulse delay-200">★</span>
                    <span className="animate-pulse delay-300">★</span>
                    <span className="animate-pulse delay-400">★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">"Service impeccable ! La voiture était propre et en parfait état. Le processus de réservation était simple et rapide. Je recommande vivement !"</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 hover:shadow-xl animate-slide-up delay-100">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl animate-bounce-slow">
                  T
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Thomas Dubois</h4>
                  <div className="flex text-yellow-400">
                    <span className="animate-pulse">★</span>
                    <span className="animate-pulse delay-100">★</span>
                    <span className="animate-pulse delay-200">★</span>
                    <span className="animate-pulse delay-300">★</span>
                    <span className="animate-pulse delay-400">★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">"J'ai loué une BMW pour un week-end et c'était une expérience fantastique. Le personnel était très professionnel et la voiture était un rêve à conduire."</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 hover:shadow-xl animate-slide-up delay-200">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl animate-bounce-slow">
                  L
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Laura Petit</h4>
                  <div className="flex text-yellow-400">
                    <span className="animate-pulse">★</span>
                    <span className="animate-pulse delay-100">★</span>
                    <span className="animate-pulse delay-200">★</span>
                    <span className="animate-pulse delay-300">★</span>
                    <span className="animate-pulse">☆</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">"Prix compétitifs et service client réactif. La prise en charge et le retour du véhicule se sont déroulés sans problème. Je reviendrai !"</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section avec animation */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4 animate-fade-in">Prêt à prendre la route ?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto animate-fade-in delay-100">
            Inscrivez-vous dès maintenant et bénéficiez de 10% de réduction sur votre première location.
          </p>
          {!isAuthenticated ? (
            <Link 
              to="/register" 
              className="px-6 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-lg inline-block animate-bounce-slow"
            >
              S'inscrire maintenant
            </Link>
          ): (
            <Link 
              to="/profile" 
              className="px-6 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-lg inline-block animate-bounce-slow"
            >
              Mon Profil
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;