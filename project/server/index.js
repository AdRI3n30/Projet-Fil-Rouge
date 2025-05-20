import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config();
const { PrismaClient } = pkg;

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Accès non autorisé' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token invalide' });
    req.user = user;
    next();
  });
};

app.get('/', (req, res) => {
  res.send('Bienvenue sur l\'API de location de voitures ! 🚗');
});


// Routes d'authentification
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    const userExists = await prisma.user.findUnique({
      where: { email }
    });
    
    if (userExists) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      }
    });
    
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });
    
    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'inscription', error: error.message });
  }
});

app.get('/api/users',  async (req, res) => {
  try {
  
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error: error.message });
  }
});


app.put('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const { id } = req.params;
    const { name, role } = req.body;

    // Vérifie si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: Number(id) }
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Mise à jour de l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        name,
        role
      }
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur', error: error.message });
  }
});


app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const { id } = req.params;

    // Vérifie si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: Number(id) }
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Suppression de l'utilisateur
    await prisma.user.delete({
      where: { id: Number(id) }
    });

    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur', error: error.message });
  }
});



app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }
    
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    // 🔹 Afficher le token dans la console
    console.log(`✅ Nouveau token généré : ${token}`);
    res.status(200).json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Erreur lors de la connexion :', error.message);
    res.status(500).json({ message: 'Erreur lors de la connexion', error: error.message });
  }
});


// Routes pour les voitures
app.get('/api/cars', async (req, res) => {
  try {
    const cars = await prisma.car.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des voitures', error: error.message });
  }
});

app.get('/api/cars/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const car = await prisma.car.findUnique({
      where: { id: Number(id) }
    });
    
    if (!car) {
      return res.status(404).json({ message: 'Voiture non trouvée' });
    }
    
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la voiture', error: error.message });
  }
});

app.post('/api/cars', async (req, res) => {
  try {

    
    const { brand, model, year, color, price, description, imageUrl } = req.body;
    
    const car = await prisma.car.create({
      data: {
        brand,
        model,
        year,
        color,
        price,
        description,
        imageUrl
      }
    });
    
    res.status(201).json(car);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la voiture', error: error.message });
  }
});


app.put('/api/cars/:id',  async (req, res) => {
  try {

    const { id } = req.params;
    const { brand, model, year, color, price, description, imageUrl, available } = req.body;

    // Vérifie si la voiture existe
    const car = await prisma.car.findUnique({
      where: { id: Number(id) }
    });

    if (!car) {
      return res.status(404).json({ message: 'Voiture non trouvée' });
    }

    // Mise à jour de la voiture
    const updatedCar = await prisma.car.update({
      where: { id: Number(id) },
      data: {
        brand,
        model,
        year,
        color,
        price,
        description,
        imageUrl,
        available
      }
    });

    res.status(200).json(updatedCar);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la voiture', error: error.message });
  }
});


app.delete('/api/cars/:id', authenticateToken, async (req, res) => {
  try {

    const { id } = req.params;

    // Vérifie si la voiture existe
    const car = await prisma.car.findUnique({
      where: { id: Number(id) }
    });

    if (!car) {
      return res.status(404).json({ message: 'Voiture non trouvée' });
    }

    // Suppression de la voiture
    await prisma.car.delete({
      where: { id: Number(id) }
    });

    res.status(200).json({ message: 'Voiture supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la voiture', error: error.message });
  }
});



// Routes pour les locations
app.post('/api/rentals', authenticateToken, async (req, res) => {
  try {
    const { carId, startDate, endDate, totalPrice } = req.body;
    
    const car = await prisma.car.findUnique({
      where: { id: Number(carId) }
    });
    
    if (!car || !car.available) {
      return res.status(400).json({ message: 'Voiture non disponible' });
    }
    
    const rental = await prisma.rental.create({
      data: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalPrice,
        userId: req.user.id,
        carId: Number(carId)
      }
    });
    
    await prisma.car.update({
      where: { id: Number(carId) },
      data: { available: false }
    });
    
    res.status(201).json(rental);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la location', error: error.message });
  }
});

app.get('/api/rentals', async (req, res) => {
  try {
    const rentals = await prisma.rental.findMany({
      include: {
        car: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des locations', error: error.message });
  }
});



app.get('/api/rentals/:id',  async (req, res) => {
  try {
    const { id } = req.params;

    const rental = await prisma.rental.findUnique({
      where: { id: Number(id) },
      include: {
        car: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!rental) {
      return res.status(404).json({ message: 'Location non trouvée' });
    }

    res.status(200).json(rental);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la location', error: error.message });
  }
});

app.put('/api/rentals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Vérification des statuts valides
    const allowedStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: `Statut invalide : ${status}` });
    }

    // Récupération de la location
    const rental = await prisma.rental.findUnique({
      where: { id: Number(id) }
    });

    if (!rental) {
      return res.status(404).json({ message: 'Location non trouvée.' });
    }

    // Mise à jour de la location
    const updatedRental = await prisma.rental.update({
      where: { id: Number(id) },
      data: { status }
    });

    // Mise à jour de la disponibilité de la voiture
    if (status === 'CONFIRMED') {
      await prisma.car.update({
        where: { id: rental.carId },
        data: { available: false }
      });
    } else if (status === 'CANCELLED') {
      await prisma.car.update({
        where: { id: rental.carId },
        data: { available: true }
      });
    }

    res.status(200).json(updatedRental);

  } catch (error) {
    console.error('Erreur PUT /api/rentals/:id :', error);
    res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
});




app.delete('/api/rentals/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const rental = await prisma.rental.findUnique({
      where: { id: Number(id) }
    });

    if (!rental) {
      return res.status(404).json({ message: 'Location non trouvée' });
    }



    await prisma.rental.delete({
      where: { id: Number(id) }
    });

    await prisma.car.update({
      where: { id: rental.carId },
      data: { available: true }
    });

    res.status(200).json({ message: 'Location supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la location', error: error.message });
  }
});


// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});