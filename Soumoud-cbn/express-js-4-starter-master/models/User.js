const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  consumer_id_stripe: {
    type: String,
    required: true
  },
   nom_de_famille: {
    type: String,
    required: true
  },
  prenom: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  mot_de_passe: {
    type: String,
    required: true
  },
  numero: {
    type: String,
    required: true,
    unique: true
  },
  path_img_cin: {
    type: String,
    required: true
  },
  path_txt_cin: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    required: true
  },
  lat: {
    type: String
  },
  lng: {
    type: String
  },
  providerName: {
    type: String
  },
  productsCounts: {
    type: Number
  },
  deliveryTime: {
    type: String
  },
  adminLinkPDFToBeProvider: {
    type: String
  },
  adminLinkToRecommandation: {
    type: String
  },
  adminLinkMentionsLegales: {
    type: String
  }
  
});

module.exports = mongoose.model('user', UserSchema);
