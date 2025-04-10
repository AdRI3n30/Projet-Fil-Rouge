import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white pt-10 pb-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Car className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl">AutoLoc</span>
            </div>
            <p className="text-gray-400 mb-4">
              Votre partenaire de confiance pour la location de voitures de qualité à des prix compétitifs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">Accueil</Link>
              </li>
              <li>
                <Link to="/cars" className="text-gray-400 hover:text-white">Nos Voitures</Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-white">Connexion</Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-white">Inscription</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Nos Services</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">Location de voitures</li>
              <li className="text-gray-400">Assurance tous risques</li>
              <li className="text-gray-400">Assistance 24/7</li>
              <li className="text-gray-400">Kilométrage illimité</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400">
                <MapPin className="h-5 w-5 mr-2" />
                <span>123 Rue de la Location, 75000 Paris</span>
              </li>
              <li className="flex items-center text-gray-400">
                <Phone className="h-5 w-5 mr-2" />
                <span>+33 1 23 45 67 89</span>
              </li>
              <li className="flex items-center text-gray-400">
                <Mail className="h-5 w-5 mr-2" />
                <span>contact@autoloc.fr</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} AutoLoc. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;