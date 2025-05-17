// AddCarForm.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AddCarForm: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    color: '',
    price: '',
    description: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Préparer les données en convertissant year et price en nombres
      const payload = {
        brand: formData.brand,
        model: formData.model,
        year: Number(formData.year),
        color: formData.color,
        price: Number(formData.price),
        description: formData.description,
        imageUrl: formData.imageUrl
      };

      await axios.post('http://localhost:5000/api/cars', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      navigate('/vendeur');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l’ajout de la voiture.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6">Ajouter une voiture</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="brand"
          placeholder="Marque"
          value={formData.brand}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="model"
          placeholder="Modèle"
          value={formData.model}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="number"
          name="year"
          placeholder="Année"
          value={formData.year}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="color"
          placeholder="Couleur"
          value={formData.color}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Prix (€)"
          value={formData.price}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          rows={3}
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="URL de l’image"
          value={formData.imageUrl}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Ajout en cours...' : 'Ajouter'}
        </button>
      </form>
    </div>
  );
};

export default AddCarForm;
