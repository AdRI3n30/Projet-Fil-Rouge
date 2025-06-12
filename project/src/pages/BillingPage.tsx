import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BillingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { rental, car } = location.state || {};

  const [billingInfo, setBillingInfo] = React.useState({
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const [formError, setFormError] = React.useState<string | null>(null);

  if (!rental || !car) {
    return <div>Erreur : informations de commande manquantes.</div>;
  }

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBillingInfo({ ...billingInfo, [e.target.name]: e.target.value });
  };

  const handlePayment = () => {
    if (!billingInfo.address || !billingInfo.city || !billingInfo.postalCode || !billingInfo.country) {
      setFormError('Merci de remplir tous les champs de facturation.');
      return;
    }
    setFormError(null);
    alert('Paiement effectué avec succès !');
    navigate('/'); 
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
      <form className="space-y-4 mb-6" onSubmit={e => { e.preventDefault(); handlePayment(); }}>
        <h3 className="text-lg font-semibold mb-2">Adresse de facturation</h3>
        <input
          type="text"
          name="address"
          placeholder="Adresse"
          value={billingInfo.address}
          onChange={handleBillingChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="city"
          placeholder="Ville"
          value={billingInfo.city}
          onChange={handleBillingChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="postalCode"
          placeholder="Code postal"
          value={billingInfo.postalCode}
          onChange={handleBillingChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="country"
          placeholder="Pays"
          value={billingInfo.country}
          onChange={handleBillingChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        {formError && <p className="text-red-500 text-sm">{formError}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Payer maintenant
        </button>
      </form>
    </div>
  );
};

export default BillingPage;