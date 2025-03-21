const express = require("express");
const router = express.Router();
const City = require("../models/City");

router.get('/', async (req, res) => {
  const { name } = req.query;

  let query = {};
  if (name && name.length > 0) {
    query.name = { $regex: name, $options: 'i' }; // recherche partielle, case-insensitive
  } else {
    // Si aucun nom donné, renvoie un tableau vide (important!)
    return res.json([]);
  }

  try {
    const cities = await City.find(query).limit(10);
    res.json(cities);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
});
// Ajouter une ville
router.post("/", async (req, res) => {
  try {
    const newCity = new City(req.body);
    await newCity.save();
    res.status(201).json(newCity);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de l'ajout" });
  }
});

module.exports = router;
