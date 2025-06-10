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
    price: '',
    imageUrl: '',
    description: '' // Ajouté ici
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/cars/${id}`);
        const { brand, model, year, price, imageUrl, description } = res.data;
        setFormData({ brand, model, year, price, imageUrl, description: description || '' }); // Ajouté description
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('brand', formData.brand);
      formDataToSend.append('model', formData.model);
      formDataToSend.append('year', formData.year);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('description', formData.description); // Ajouté ici
      if (file) {
        formDataToSend.append('image', file);
      } else {
        formDataToSend.append('imageUrl', formData.imageUrl);
      }
      await axios.put(`http://localhost:5000/api/cars/${id}`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
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
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
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
          name="price"
          placeholder="Prix par jour (€)"
          value={formData.price}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          rows={4}
          required
        />
        {/* Affichage de l'image actuelle */}
        {formData.imageUrl && (
          <div className="mb-2">
            <img
              src={formData.imageUrl.startsWith('/uploads/') ? `http://localhost:5000${formData.imageUrl}` : formData.imageUrl}
              alt="Aperçu"
              className="h-32 object-cover rounded mb-2"
            />
            <div className="text-xs text-gray-500">Image actuelle</div>
          </div>
        )}
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
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
