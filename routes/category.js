const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

// Récupérer toutes les catégories
// Récupérer toutes les catégories
router.get("/", async (req, res) => {
    try {
      const categories = await Category.find().sort({ nom: 1 });
      res.json(categories);
    } catch (err) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
// Ajouter une catégorie
router.post("/", async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de l'ajout" });
  }
});

module.exports = router;
