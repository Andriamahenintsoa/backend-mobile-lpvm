// backend/server.js
const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');

const dotenv = require('dotenv');


const entityRoutes = require('./routes/entity');
const categoryRoutes = require('./routes/category');
const cityRoutes = require('./routes/city');
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connecté')).catch(err => console.log(err));

// Routes

app.use('/api/entity', entityRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/city', cityRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
