import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BillingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { rental, car } = location.state || {};

  if (!rental || !car) {
    return <div>Erreur : informations de commande manquantes.</div>;
  }

  // Simule un paiement
  const handlePayment = () => {
    alert('Paiement effectué avec succès !');
    navigate('/'); // Redirige vers l'accueil ou une page de confirmation
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6">Facturation</h2>
      <div className="bg-white rounded shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-2">Détails de la commande</h3>
        <p><b>Voiture :</b> {car.brand} {car.model} ({car.year})</p>
        <p><b>Du :</b> {new Date(rental.startDate).toLocaleDateString()} <b>au</b> {new Date(rental.endDate).toLocaleDateString()}</p>
        <p><b>Prix total :</b> {rental.totalPrice} €</p>
      </div>
      <button
        onClick={handlePayment}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        Payer maintenant
      </button>
    </div>
  );
};

export default BillingPage;