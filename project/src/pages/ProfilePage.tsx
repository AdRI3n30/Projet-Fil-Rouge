import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { User, Calendar, Car as CarIcon, Clock, Loader, AlertCircle } from 'lucide-react';

interface Rental {
  id: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  car: {
    id: number;
    brand: string;
    model: string;
    imageUrl: string;
  };
}

const ProfilePage: React.FC = () => {
  const { user, token } = useAuth();
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updateMsg, setUpdateMsg] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(user);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/rentals', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Filtrer les locations pour ne garder que celles de l'utilisateur connecté
        setRentals(response.data.filter((rental: any) => rental.userId === user?.id));
      } catch (err: any) {
        setError(err.response?.data?.message || 'Une erreur est survenue lors de la récupération de vos locations');
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, [token, user]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/api/users/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data);
        setNewName(res.data.name); // pour pré-remplir le champ nom
      } catch (err) {
        // Optionnel : gestion d'erreur
      }
    };
    if (user?.id) fetchProfile();
  }, [user, token]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'En attente';
      case 'CONFIRMED':
        return 'Confirmée';
      case 'COMPLETED':
        return 'Terminée';
      case 'CANCELLED':
        return 'Annulée';
      default:
        return status;
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateMsg(null);
    if (newPassword && newPassword !== confirmPassword) {
      setUpdateMsg("Les mots de passe ne correspondent pas.");
      return;
    }
    try {
      await axios.put(
        `/api/users/${user?.id}`,
        { name: newName, password: newPassword || undefined },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUpdateMsg('Profil mis à jour !');
      setEditMode(false);
      window.location.reload();
    } catch (err: any) {
      setUpdateMsg('Erreur lors de la mise à jour');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Chargement de votre profil...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Mon Profil</h1>
        </div>
        
        <div className="p-6">
          <div className="flex items-center mb-8">
            <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <User className="h-10 w-10" />
            </div>
            <div className="ml-6">
              {editMode ? (
                <form onSubmit={handleUpdateProfile} className="space-y-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="border px-2 py-1 rounded w-full"
                    placeholder="Nom"
                    required
                  />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="border px-2 py-1 rounded w-full"
                    placeholder="Nouveau mot de passe"
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="border px-2 py-1 rounded w-full"
                    placeholder="Confirmer le mot de passe"
                  />
                  <div className="flex gap-2 mt-2">
                    <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Enregistrer</button>
                    <button type="button" onClick={() => setEditMode(false)} className="bg-gray-300 px-3 py-1 rounded">Annuler</button>
                  </div>
                  {updateMsg && <p className="text-sm mt-1">{updateMsg}</p>}
                </form>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-800">{profile?.name}</h2>
                  <p className="text-gray-600">{user?.email}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Membre depuis {new Date(user?.createdAt || Date.now()).toLocaleDateString('fr-FR', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                  <button
                    onClick={() => setEditMode(true)}
                    className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm"
                  >
                    Modifier mes infos
                  </button>
                  {updateMsg && <p className="text-sm mt-1">{updateMsg}</p>}
                </>
              )}
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Mes Locations</h3>
            
            {error && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}
            
            {rentals.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <CarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-800 mb-2">Aucune location trouvée</h4>
                <p className="text-gray-600">Vous n'avez pas encore loué de voiture.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {rentals.map((rental) => (
                  <div key={rental.id} className="bg-gray-50 rounded-lg p-4 shadow-sm">
                    <div className="sm:flex sm:items-center sm:justify-between">
                      <div className="sm:flex sm:items-center">
                        <img 
                          src={rental.car.imageUrl.startsWith('/uploads/')
                        ? `${rental.car.imageUrl}`
                        : rental.car.imageUrl}
                      alt={`${rental.car.brand} ${rental.car.model}`}
                          className="h-20 w-20 object-cover rounded-md"
                        />
                        <div className="mt-4 sm:mt-0 sm:ml-4">
                          <h4 className="text-lg font-medium text-gray-800">
                            {rental.car.brand} {rental.car.model}
                          </h4>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{formatDate(rental.startDate)} - {formatDate(rental.endDate)}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>Réservé le {formatDate(rental.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0 flex flex-col items-end">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(rental.status)}`}>
                          {getStatusLabel(rental.status)}
                        </span>
                        <p className="text-lg font-bold text-blue-600 mt-2">
                          {rental.totalPrice}€
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;