const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Entity = require("../models/Entity");
const Category = require('../models/Category');

// Récupérer toutes les entreprises avec filtres
// Récupérer les entités avec filtres
router.get('/', async (req, res) => {
  try {
    const { name, category, city, bankType, telecomType } = req.query;

    console.log("🔍 Requête reçue avec :", req.query);

    let filter = {};

    // 🔹 Appliquer le filtre par nom (insensible à la casse)
    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    // 🔹 Vérification et application du filtre par catégorie
    if (category && mongoose.Types.ObjectId.isValid(category)) { 
      const categoryExists = await Category.findById(category);
      if (categoryExists) {
        filter.category = category;
      } else {
        console.log("⚠ Catégorie non trouvée :", category);
      }
    }

    // 🔹 Vérification et application du filtre par ville
    if (city && city !== '') {
      filter.city = city;
    }

    console.log("📌 Filtre appliqué avant exécution :", filter);

    // 🔹 Exécuter la requête avec les filtres
    let entities = await Entity.find(filter)
      .populate('category', 'name')
      .populate('city', 'name');

    console.log("📌 Résultats trouvés :", entities.length);

    // 🔹 Vérifier la catégorie des résultats et appliquer `bankType` et `telecomType` si nécessaire
    if (entities.length > 0) {
      const firstEntityCategory = entities[0].category?.name.toLowerCase();

      if (firstEntityCategory === 'banque' && bankType && bankType !== 'Tout') {
        entities = entities.filter(entity => entity.bankType === bankType);
      }

      if (firstEntityCategory === 'téléphonique' && telecomType && telecomType !== 'Tout') {
        entities = entities.filter(entity => entity.telecomType === telecomType);
      }
    }

    res.json(entities);
  } catch (err) {
    console.error("❌ Erreur serveur :", err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour créer une entité (simplifié)
router.post('/', async (req, res) => {
  try {
    const newEntity = new Entity(req.body);
    const entity = await newEntity.save();
    res.json(entity);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveddur');
  }
});


module.exports = router;
