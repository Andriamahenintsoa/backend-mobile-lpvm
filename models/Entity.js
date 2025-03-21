const mongoose = require("mongoose");

const entitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },

  // Type pour les banques (Agence, GAB)
  bankType: { 
    type: String, 
    enum: ['Agence', 'GAB'],
    required: false // On va le gérer dynamiquement dans `pre('save')`
  },

  // Type pour les opérateurs téléphoniques (Kiosque, Mvola)
  telecomType: { 
    type: String, 
    enum: ['Kiosque', 'Mvola'], 
    required: false
  }
}, { timestamps: true });

// ✅ Gestion dynamique des champs `bankType` et `telecomType`
entitySchema.pre('save', async function (next) {
  if (this.category) {
    const Category = require('../models/Category');
    const categoryDoc = await Category.findById(this.category);

    if (categoryDoc) {
      if (categoryDoc.name.toLowerCase() === 'banque') {
        this.bankType = this.bankType || 'Agence'; // Valeur par défaut
        this.telecomType = undefined; // Effacer telecomType si ce n'est pas un opérateur téléphonique
      } 
      else if (categoryDoc.name.toLowerCase() === 'téléphonique') {
        this.telecomType = this.telecomType || 'Kiosque'; // Valeur par défaut
        this.bankType = undefined; // Effacer bankType si ce n'est pas une banque
      } 
      else {
        this.bankType = undefined;
        this.telecomType = undefined;
      }
    }
  }
  next();
});

// ✅ Ajout d'un index texte pour la recherche rapide
entitySchema.index({ name: "text" });

module.exports = mongoose.model("Entity", entitySchema);
