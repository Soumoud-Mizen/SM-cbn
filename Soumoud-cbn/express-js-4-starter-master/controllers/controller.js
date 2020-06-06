const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');

const User = require('../models/User');
const Card = require('../models/Card');
const Product = require('../models/Product');
const Faq = require('../models/Faq');
const SECRET_API_KEY_STRIPE = config.get('SECRET_API_KEY_STRIPE');
const stripe = require('stripe')(SECRET_API_KEY_STRIPE);
const Payment = require('../models/Payment');

exports.createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    nom_de_famille,
    prenom,
    email,
    mot_de_passe,
    numero,
    path_img_cin,
    path_txt_cin,
    role,
    providerName,
    lat,
    lng,
    consumer_id_stripe,
    code_prom
  } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user !== null) {
      let msg = "L'utilisateur existe déjà avec : ";

      if (user.email === email) {
        msg += ' - Email ';
      }

      if (user.numero === numero) {
        msg += ' - Numero ';
      }

      if (user.path_txt_cin === path_txt_cin) {
        msg += ' - CIN ';
      }

      return res.status(400).json({ msg });
    }

    user = new User({
      nom_de_famille,
      prenom,
      email,
      mot_de_passe,
      numero,
      path_img_cin:
        req.protocol + '://' + req.get('host') + '/images/' + req.file.filename,
      path_txt_cin,
      role,
      providerName,
      lat,
      lng,
      productsCounts: 0,
      deliveryTime: '10:30',
      consumer_id_stripe
    });

    if (!role || role === 'consumer') {
      user.role = await 'consumer';
    }

    let consumer = null;
    if (user.role === 'consumer') {
      consumer = await stripe.customers.create({
        description: 'Customer for ' + email
      });
      user.consumer_id_stripe = await consumer.id;
    }

    const salt = await bcrypt.genSalt(10);

    user.mot_de_passe = await bcrypt.hash(mot_de_passe, salt);

    await user.save();

    if (code_prom && code_prom !== null && code_prom !== '') {
      prom = new Promotion({
        sender_id: code_prom,
        rec_id: user._id,
        isValid: true
      });
      await prom.save();
    }

    return res.status(201).json({ msg: 'Utilisateur créer avec succès' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur de serveur créer un nouvel utilisateur');
  }
};

exports.updateUserByIdForAdmin = async (req, res) => {
  let isAdmin = await User.findOne({
    _id: req.user.id
  });
  if (isAdmin.role !== 'admin') {
    return res.status(401).json({ msg: 'Pas autorisé' });
  }

  const {
    nom_de_famille,
    prenom,
    email,
    mot_de_passe,
    numero,
    path_img_cin,
    path_txt_cin,
    role,
    providerName,
    lat,
    lng
  } = await req.body;

  try {
    let user = await User.findOne({ _id: req.params.id });
    if (!user) {
      let msg = 'pas trouver';
      return res.status(404).json({ msg });
    }

    if (nom_de_famille) {
      user.nom_de_famille = nom_de_famille;
    }

    if (prenom) {
      user.prenom = prenom;
    }

    if (email) {
      user.email = email;
    }

    if (mot_de_passe) {
      const salt = await bcrypt.genSalt(10);
      user.mot_de_passe = await bcrypt.hash(mot_de_passe, salt);
    }

    if (numero) {
      user.numero = numero;
    }

    if (req.file) {
      user.path_img_cin =
        req.protocol + '://' + req.get('host') + '/images/' + req.file.filename;
    }

    if (path_txt_cin) {
      user.path_txt_cin = path_txt_cin;
    }

    if (providerName) {
      user.providerName = providerName;
    }

    await user.save();

    return res.status(201).json({ msg: 'utilisateur mise à jour avec succès' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur de serveur créer un nouvel utilisateur');
  }
};

exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, mot_de_passe } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ msg: "Les informations d'identification invalides" });
    }

    const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);

    if (!isMatch) {
      return res
        .status(400)
        .json({ msg: "Les informations d'identification invalides" });
    }

    if (
      user.role !== 'admin' &&
      user.role !== 'provider' &&
      user.role !== 'consumer'
    ) {
      return res
        .status(400)
        .json({ msg: "Veuillez confirmer votre comptes avec l'admin" });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        return res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error : loginUser');
  }
};

exports.returnCurrentUserObject = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-mot_de_passe');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error:  2');
    // returnUserObject : 2
  }
};

exports.addFAQ = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, detail } = req.body;

  try {
    let user = await User.findById(req.user.id).select('-mot_de_passe');

    if (!user && user.role !== 'admin') {
      return res.status(401).json({ msg: 'Pas autorisé' });
    }

    let faq = await Faq.findOne({ title });
    if (faq) {
      return res.status(400).json({ msg: 'FAQ existe déjà !' });
    }

    newFAQ = new Faq({
      title,
      detail
    });

    await newFAQ.save();

    res.json({ id: newFAQ.id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur de serveur créer FAQ');
  }
};

exports.addCardToCurrentUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { brand, country, exp_month, exp_year, last4, card_token } = req.body;

  try {
    let user = await User.findById(req.user.id).select('-mot_de_passe');

    if (!user) {
      return res.status(400).json({ msg: "L'utilisateur n'existe pas !" });
    }

    if (user.id !== req.user.id) {
      return res.status(401).json({ msg: 'Pas autorisé' });
    }

    let card = await Card.findOne({ card_token, user_id: req.user.id });
    if (card) {
      return res.status(400).json({ msg: 'Carte existe déjà !' });
    }

    let newCardStripe = await stripe.customers.createSource(
      user.consumer_id_stripe,
      {
        source: card_token
      }
    );
    if (!newCardStripe) {
      return res.status(500).json({ msg: 'Erreur carte stripe!' });
    }
    newCard = new Card({
      user_id: user.id,
      brand,
      country,
      exp_month,
      exp_year,
      last4,
      card_stripe_id: card_token
    });

    await newCard.save();

    if (newCard) {
      res.json({ id: newCard.id });
    } else {
      return res.status(500).json({ msg: 'Erreur carte!' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur de serveur créer card');
  }
};

exports.getCurrentUserCards = async (req, res) => {
  try {
    const card = await Card.find({ user_id: req.user.id }).select(
      '-card_stripe_id'
    );
    return res.json(card);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error : getCurrentUserCards');
  }
};

exports.deleteCurrentUserCard = async (req, res) => {
  try {
    let card = await Card.findOne({ _id: req.params.id, user_id: req.user.id });

    if (card === null) {
      return res.status(404).json({ msg: 'Pas trouver' });
    }

    const cardToDelete = await Card.deleteOne({
      _id: req.params.id
    });

    if (cardToDelete.deletedCount !== 0) {
      return res.json({ message: 'Successfully deleted' });
    } else {
      return res.json({ message: 'Cant delete' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error : deleteCurrentUserCard');
  }
};

exports.getFAQS = async (req, res) => {
  try {
    const FAQS = await Faq.find();
    return res.json(FAQS);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error : getFAQS');
  }
};

exports.getConsumersForAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.role !== 'admin') {
      return res.status(401).json({ msg: 'Pas autorisé' });
    }
    const consumers = await User.find({ role: 'consumer' }).select('-password');
    return res.json(consumers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error : getConsumersForAdmin');
  }
};

exports.getProvidersForAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user === null || user.role !== 'admin') {
      return res.status(401).json({ msg: 'Pas autorisé' });
    }
    const providers = await User.find({ role: 'provider' }).select('-password');
    return res.json(providers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error : getProvidersForAdmin');
  }
};

exports.getPromotionsForConsumer = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user === null || user.role !== 'consumer') {
      return res.status(401).json({ msg: 'Pas autorisé' });
    }
    const promotions = await Promotion.find({sender_id: req.user.id, isValid: true});
    return res.json(promotions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error : getProviderForConsumer');
  }
};

exports.getProviderForConsumer = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user === null || user.role !== 'consumer') {
      return res.status(401).json({ msg: 'Pas autorisé' });
    }
    const provider = await User.findById(req.params.id).select('-password');
    return res.json(provider);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error : getProviderForConsumer');
  }
};

exports.getFullNameByID = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user === null || user.role !== 'provider') {
      return res.status(401).json({ msg: 'Pas autorisé' });
    }

    const cons = await Payment.findByID(req.body.id);
    let txt = cons.nom_de_famille + ' ' + cons.prenom;
    return res.json(txt);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error : getProvidersForConsumer');
  }
};

exports.getContactCmdForProvider = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user === null || user.role !== 'provider') {
      return res.status(401).json({ msg: 'Pas autorisé' });
    }
    const ids = await Payment.find({ provider_id: req.user.id }).distinct(
      'user_id'
    );

    const arrayToSend = [];
    const promises = await ids.map(
      item =>
        new Promise((resolve, reject) => {
          User.findById(item, (err, data) => {
            if (err) console.log(err);
            else
              arrayToSend.push({
                id: item,
                fullname: data.nom_de_famille + ' ' + data.prenom
              });
            resolve();
          });
        })
    );

    await Promise.all(promises).then(() => {
      return res.json(arrayToSend);
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error : getProvidersForConsumer');
  }
};

exports.getContactProvidersForConsumer = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user === null || user.role !== 'consumer') {
      return res.status(401).json({ msg: 'Pas autorisé' });
    }
    const chats = await Payment.distinct('provider_name');
    return res.json(chats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error : getProvidersForConsumer');
  }
};

exports.getProvidersForConsumer = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user === null || user.role !== 'consumer') {
      return res.status(401).json({ msg: 'Pas autorisé' });
    }
    const providers = await User.find({
      role: 'provider',
      productsCounts: { $gt: 0 }
    }).select('-password');
    return res.json(providers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error : getProvidersForConsumer');
  }
};

exports.getPublicSettings = async (req, res) => {
  try {
    const admin = await User.find({ role: 'admin' });
    if (admin === null) {
      return res.status(401).json({ msg: 'Pas autorisé' });
    }

    return await res.status(200).json({
      settings: {
        adminLinkToRecommandation: admin[0].adminLinkToRecommandation,
        adminLinkPDFToBeProvider: admin[0].adminLinkPDFToBeProvider,
        adminLinkMentionsLegales: admin[0].adminLinkMentionsLegales
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error : 6');
    // getproviders : 5
  }
};

exports.changeAdminLinkToRecommandation = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(401).json({ msg: 'Pas autorisé' });
    }

    if (req.body.txt) {
      user.adminLinkToRecommandation = await req.body.txt;
      user.save();
      return res.status(200).json({ msg: 'ok' });
    } else {
      return res.status(500).json({ msg: 'error' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error : 6');
    // getproviders : 5
  }
};

exports.changeAdminLinkMentionsLegales = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(401).json({ msg: 'Pas autorisé' });
    }

    if (req.body.txt) {
      user.adminLinkMentionsLegales = await req.body.txt;
      user.save();
      return res.status(200).json({ msg: 'ok' });
    } else {
      return res.status(500).json({ msg: 'error' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error : 6');
    // getproviders : changeAdminLinkMentionsLegales
  }
};

exports.changeAdminLinkPDFToBeProvider = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(401).json({ msg: 'Pas autorisé' });
    }

    if (req.body.txt) {
      user.adminLinkPDFToBeProvider = await req.body.txt;
      user.save();
      return res.status(200).json({ msg: 'ok' });
    } else {
      return res.status(500).json({ msg: 'error' });
    }
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .send('Server Error : changeAdminLinkPDFToBeProvider');

    // getproviders : 5
  }
};

exports.getNoConfirmedProvidersForAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(401).json({ msg: 'Pas autorisé' });
    }
    const providers = await User.find({
      role: 'provider-not-confirmed'
    }).select('-password');
    return res.json(providers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error : 6');
    // getproviders : 5
  }
};

exports.returnUserObjectByIDForAdmin = async (req, res) => {
  const admin = await User.findById(req.user.id);
  if (admin.role !== 'admin') {
    return res.status(401).json({ msg: 'Pas autorisé' });
  }
  try {
    const user = await User.findById(req.body.id).select('-mot_de_passe');
    if (user) {
      return res.json(user);
    } else {
      return res.status(404).json({ msg: 'Pas trouver' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error:  returnUserObjectByIDForAdmin');
  }
};

exports.addProductToProvider = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, price, desc, cat, status } = await req.body;

  const provider = await User.findById(req.user.id);
  if (provider.role !== 'provider') {
    return res.status(401).json({ msg: 'Pas autorisé' });
  }

  let pC = await parseInt(provider.productsCounts, 10);
  if (status === 'disponible') {
    provider.productsCounts = await parseInt(pC + 1, 10);
  }
  await provider.save();

  let product = await Product.findOne({ title, user_id: req.user.id });
  if (product) {
    return res
      .status(400)
      .json({ msg: 'Produit existe déjà avec ce fournisseur' });
  }

  try {
    product = new Product({
      user_id: req.user.id,
      title,
      img:
        req.protocol + '://' + req.get('host') + '/images/' + req.file.filename,
      price,
      desc,
      cat,
      status
    });

    await product.save();

    return res.json({
      id: product.id
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur de serveur créer une nouvel Product');
  }
};

exports.deleteProductProvider = async (req, res) => {
  const provider = await User.findById(req.user.id);
  if (provider.role !== 'provider') {
    return res.status(401).json({ msg: 'Pas autorisé' });
  }

  let product = await Product.findOne({ _id: req.params.id });
  if (product.user_id !== req.user.id) {
    return res.status(401).json({ msg: 'Pas autorisé' });
  }

  let pC = await parseInt(provider.productsCounts, 10);
  if (product.status === 'disponible') {
    provider.productsCounts = await parseInt(pC - 1, 10);
    await provider.save();
  }

  try {
    const productDelete = await Product.deleteOne({
      _id: req.params.id
    });

    if (productDelete.deletedCount !== 0) {
      return res.json({ message: 'Successfully deleted' });
    } else {
      return res.json({ message: 'Cant delete' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error : deleteProductProvider');
  }
};

exports.deleteFaqByIDForAdmin = async (req, res) => {
  const admin = await User.findById(req.user.id);
  if (!admin || admin.role !== 'admin') {
    return res.status(401).json({ msg: 'Pas autorisé' });
  }

  try {
    let faq = await Faq.findOne({ _id: req.params.id });

    if (faq === null) {
      return res.status(404).json({ msg: 'Pas trouver' });
    }

    const faqToDelete = await Faq.deleteOne({
      _id: req.params.id
    });

    if (faqToDelete.deletedCount !== 0) {
      return res.json({ message: 'Successfully deleted' });
    } else {
      return res.json({ message: 'Cant delete' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error : deleteCurrentUserCard');
  }
};

exports.getFaqByIdForAdmin = async (req, res) => {
  const admin = await User.findById(req.user.id);
  if (admin === null || admin.role !== 'admin') {
    return res.status(401).json({ msg: 'Pas autorisé' });
  }

  try {
    let faq = await Faq.findOne({ _id: req.params.id });
    if (!faq) {
      return res.status(404).json({ msg: 'Pas trouver' });
    }
    return res.json(faq);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error : getFaqByIdForAdmin');
  }
};

exports.getProductByIDForCurrentProvider = async (req, res) => {
  const provider = await User.findById(req.user.id);
  if (provider && provider.role !== 'provider') {
    return res.status(401).json({ msg: 'Pas autorisé' });
  }
  let product = await Product.findOne({ _id: req.params.id });
  if (product.user_id !== req.user.id) {
    return res.status(401).json({ msg: 'Pas autorisé' });
  }
  try {
    let product = await Product.findOne({ _id: req.params.id });
    if (!product) {
      return res.status(404).json({ msg: 'Pas trouver' });
    }
    return res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error : getProductByIDForCurrentProvider');
  }
};

exports.getProductsForCurrentProvider = async (req, res) => {
  const provider = await User.findById(req.user.id);
  if (provider.role !== 'provider') {
    return res.status(401).json({ msg: 'Pas autorisé' });
  }
  try {
    const products = await Product.find({ user_id: req.user.id });
    return res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error : 7');
    // getProductsForProvider : 7
  }
};

exports.getProductsForUserByIDProvider = async (req, res) => {
  // const user = await User.findById(req.user.id);
  // if (user === null) {
  //   return res.status(401).json({ msg: 'Pas autorisé' });
  // }

  try {
    const products = await Product.find({
      user_id: req.params.id,
      status: 'disponible'
    });
    return res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error : getProductsForConsumerByIDProvider');
  }
};

exports.updateProductToCurrentProvider = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let product = await Product.findOne({
    _id: req.params.id
  });

  if (!product) {
    return res.status(404).json({ msg: 'Pas trouver' });
  }

  const { user_id, title, img, price, desc, cat, status } = await req.body;

  try {
    product.title = await title;
    if (req.file) {
      product.img =
        (await req.protocol) +
        '://' +
        (await req.get('host')) +
        '/images/' +
        (await req.file.filename);
    }
    product.price = await price;
    product.desc = await desc;
    product.cat = await cat;
    product.status = await status;

    await product.save();

    return res.json({
      msg: 'updated'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur de serveur update Product');
  }
};

exports.deleteUserByAdmin = async (req, res) => {
  const admin = await User.findById(req.user.id);
  if (admin.role !== 'admin') {
    return res.status(401).json({ msg: 'Pas autorisé' });
  }

  let user = await User.findOne({ _id: req.params.id });
  if (!user) {
    return res.status(404).json({ msg: 'Pas trouver' });
  }

  try {
    const userDelete = await User.deleteOne({
      _id: req.params.id
    });

    if (userDelete.deletedCount !== 0) {
      return res.json({ message: 'Successfully deleted' });
    } else {
      return res.json({ message: 'Cant delete' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error : deleteProductProvider');
  }
};

exports.confirmProviderByID = async (req, res) => {
  try {
    const user = await User.findById(req.body.id).select('-mot_de_passe');
    user.role = await 'provider';
    await user.save();
    res.json({ msg: 'success' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error:  2');
    // returnUserObject : 2
  }
};

exports.changeDeliveryTimeForProvider = async (req, res) => {
  const provider = await User.findById(req.user.id);
  if (provider.role !== 'provider') {
    return res.status(401).json({ msg: 'Pas autorisé' });
  }

  console.log('==========req.body==========================');
  console.log(req.body);
  console.log('====================================');
  try {
    if (req.body.time) {
      provider.deliveryTime = await req.body.time;
      await provider.save();
      return res
        .status(201)
        .json({ msg: 'deliveryTime mise à jour avec succès' });
    } else {
      return res
        .status(500)
        .json({ msg: 'deliveryTime mise à jour avec erreur' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error : getProductByIDForCurrentProvider');
  }
};

exports.changeProductStatus = async (req, res) => {
  const provider = await User.findById(req.user.id);
  if (provider.role !== 'provider') {
    return res.status(401).json({ msg: 'Pas autorisé' });
  }
  let product = await Product.findOne({ _id: req.params.id });
  if (product.user_id !== req.user.id) {
    return res.status(401).json({ msg: 'Pas autorisé' });
  }

  let pC = await parseInt(provider.productsCounts, 10);
  if (req.body.status === 'disponible') {
    provider.productsCounts = await parseInt(pC + 1, 10);
  } else {
    provider.productsCounts = await parseInt(pC - 1, 10);
  }
  await provider.save();

  try {
    product.status = req.body.status;

    await product.save();

    return res.status(201).json({ msg: 'produit mise à jour avec succès' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error : getProductByIDForCurrentProvider');
  }
};

exports.updateGPS = async (req, res) => {
  const provider = await User.findById(req.user.id);
  if (provider.role !== 'provider') {
    return res.status(401).json({ msg: 'Pas autorisé' });
  }
  try {
    console.log('===========req.body=========================');
    console.log(req.body);
    console.log('====================================');
    if (req.body.lat && req.body.lng) {
      provider.lat = await req.body.lat;
      provider.lng = await req.body.lng;
    }
    await provider.save();

    return res.status(201).json({ msg: 'Fournisseur mise à jour avec succès' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error : getProductByIDForCurrentProvider');
  }
};

exports.createPayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = await User.findById(req.user.id);
  if (!user || user === null || user.role !== 'consumer') {
    return res.status(401).json({ msg: 'Pas autorisé' });
  }

  const {
    amount,
    currency,
    description,
    card_id,
    provider_id,
    provider_name,
    product_id
  } = req.body;

  try {
    let card = await Card.findOne({ _id: card_id });
    if (!card && card === null) {
      return res.status(404).json({ msg: 'Card not found' });
    }
    const token = await card.card_stripe_id;
    const charge = await stripe.charges.create({
      customer: user.consumer_id_stripe,
      amount: amount * 100, // Convert 0.65 TO 65€
      currency,
      description,
      source: token
    });

    if (charge) {
      newPayment = new Payment({
        user_id: req.user.id,
        card_id,
        provider_id,
        provider_name,
        product_id,
        charge_id: charge.id,
        last_4_card: card.last4,
        brand_card: card.brand,
        amount,
        currency,
        description,
        status: charge.status,
        created: charge.created
      });
      await newPayment.save();
      return res.status(201).json({ msg: 'Créer avec succès' });
    } else {
      return res.status(500).json({ msg: 'Error for charge' });
    }

    if (newPayment) {
      return res.status(201).json({ msg: 'Créer avec succès' });
    } else {
      return res.status(500).json({ msg: 'Error for charge' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur de serveur créer un nouvel utilisateur');
  }
};

exports.getCurrentOrdersHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ user_id: req.user.id });
    return res.json(payments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error : getCurrentOrdersHistory');
  }
};
