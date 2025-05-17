import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditCarPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    pricePerDay: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/cars/${id}`);
        const { brand, model, year, pricePerDay, imageUrl } = res.data;
        setFormData({ brand, model, year, pricePerDay, imageUrl });
      } catch (err: any) {
        setError('Erreur lors du chargement de la voiture.');
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await axios.put(`http://localhost:5000/api/cars/${id}`, formData);
      navigate('/vendeur'); // Retour au dashboard
    } catch (err: any) {
      setError('Erreur lors de la mise à jour.');
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6">Modifier la voiture</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="brand"
          placeholder="Marque"
          value={formData.brand}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="model"
          placeholder="Modèle"
          value={formData.model}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="number"
          name="year"
          placeholder="Année"
          value={formData.year}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="number"
          name="pricePerDay"
          placeholder="Prix par jour (€)"
          value={formData.pricePerDay}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="URL de l'image"
          value={formData.imageUrl}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Enregistrer
        </button>
      </form>
    </div>
  );
};

export default EditCarPage;
