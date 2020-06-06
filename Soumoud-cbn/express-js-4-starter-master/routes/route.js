const express = require('express');
const Controller = require('../controllers/controller');
const { check } = require('express-validator/check');
const extractImage = require('../middleware/image');
const checkAuth = require('../middleware/auth');
const router = express.Router();

// @route    POST api/sign-up
// @desc     Register user
// @access   Public
router.post(
  '/sign-up',
  extractImage,
  [
    check('nom_de_famille', 'Nom de famille est requis')
      .not()
      .isEmpty(),
    check('prenom', 'Prénom est requis')
      .not()
      .isEmpty(),
    check('email', "S'il vous plaît inclure un email valide").isEmail(),
    check(
      'mot_de_passe',
      "S'il vous plaît entrer un mot de passe avec 6 caractères ou plus"
    ).isLength({ min: 6 }),
    check('numero', 'Numéro est requis')
      .not()
      .isEmpty(),
    check('path_txt_cin', 'CIN est requis')
      .not()
      .isEmpty()
  ],
  Controller.createUser
);

// @route    POST api/sign-up
// @desc     Register user
// @access   Public
router.post(
  '/update-user-for-admin/:id',
  extractImage,
  checkAuth,
  Controller.updateUserByIdForAdmin
);

// @route    POST api/sign-up
// @desc     Register user
// @access   Public
router.post(
  '/get-provider-for-consumer/:id',
  checkAuth,
  Controller.getProviderForConsumer
);

// @route    POST api/sign-up
// @desc     Register user
// @access   Public
router.post(
  '/change-admin-link-pdf-to-be-provider',
  checkAuth,
  Controller.changeAdminLinkPDFToBeProvider
);

// @route    POST api/sign-up
// @desc     Register user
// @access   Public
router.post(
  '/change-admin-link-mentions-legales',
  checkAuth,
  Controller.changeAdminLinkMentionsLegales
);

// @route    POST api/sign-up
// @desc     Register user
// @access   Public
router.post(
  '/change-admin-link-to-recommandation',
  checkAuth,
  Controller.changeAdminLinkToRecommandation
);

// @route    POST api/sign-up
// @desc     Register user
// @access   Public
router.post('/get-public-settings', Controller.getPublicSettings);

// @route    POST api/login
// @desc     Authenticate user (login) & get token
// @access   Public
router.post(
  '/login',
  [
    check('email', "S'il vous plaît inclure un email valide").isEmail(),
    check('mot_de_passe', 'mot de passe est requis').exists()
  ],
  Controller.loginUser
);

// @route    POST api/get-user
// @desc     Get current loged user profile by token
// @access   Private
router.post('/get-user', checkAuth, Controller.returnCurrentUserObject);

// @route    POST api/add-card
// @desc     Add card to user
// @access   Private
router.post(
  '/add-faq',
  checkAuth,
  [
    check('title', 'Titre est requis')
      .not()
      .isEmpty(),
    check('detail', 'Text est requis')
      .not()
      .isEmpty()
  ],
  Controller.addFAQ
);

// @route    POST api/get-faqs
// @desc     Add card to user
// @access   Public
router.post('/get-faqs', Controller.getFAQS);

// @route    POST api/product-for-current-provider/:id
// @desc     Get product for current provider
// @access   Private
router.post(
  '/get-faq-by-id-for-admin/:id',
  checkAuth,
  Controller.getFaqByIdForAdmin
);

// @route    POST api/add-card
// @desc     Add card to user
// @access   Private
router.post(
  '/add-card',
  checkAuth,
  [
    check('brand', 'Marque est requis')
      .not()
      .isEmpty(),
    check('country', 'Pays est requis')
      .not()
      .isEmpty(),
    check('exp_month', 'Expire mois est requis')
      .not()
      .isEmpty(),
    check('exp_year', 'Expire annee est requis')
      .not()
      .isEmpty(),
    check('last4', 'Dernier 4 est requis')
      .not()
      .isEmpty(),
    check('card_token', 'Card token est requis')
      .not()
      .isEmpty()
  ],
  Controller.addCardToCurrentUser
);

// @route    POST api/get-cards
// @desc     Get all cards Authenticated user
// @access   Private
router.post('/get-cards', checkAuth, Controller.getCurrentUserCards);

// @route    POST api/delete-card/:id
// @desc     Delete current user card
// @access   Private
router.delete('/delete-card/:id', checkAuth, Controller.deleteCurrentUserCard);

// @route    POST api/delete-card/:id
// @desc     Delete current user card
// @access   Private
router.delete(
  '/delete-faq-by-id-for-admin/:id',
  checkAuth,
  Controller.deleteFaqByIDForAdmin
);

// @route    POST api/get-consumers
// @desc     Get all consumers for admin
// @access   Private
router.post(
  '/get-consumers-for-admin',
  checkAuth,
  Controller.getConsumersForAdmin
);

// @route    POST api/get-providers
// @desc     Get all providers for admin or consumer
// @access   Private
router.post(
  '/get-providers-for-admin',
  checkAuth,
  Controller.getProvidersForAdmin
);

// @route    POST api/get-providers
// @desc     Get all providers for admin or consumer
// @access   Private
router.post(
  '/get-providers-for-consumer',
  checkAuth,
  Controller.getProvidersForConsumer
);

// @access   Private
router.post(
  '/get-promotions-for-consumer',
  checkAuth,
  Controller.getPromotionsForConsumer
);

// @route    POST api/get-providers
// @desc     Get all providers for admin or consumer
// @access   Private
router.post(
  '/get-contact-providers-for-consumer',
  checkAuth,
  Controller.getContactProvidersForConsumer
);

// @route    POST api/get-providers-not-confirmed
// @desc     Get all not confirmed providers for admin
// @access   Private
router.post(
  '/get-providers-not-confirmed-for-admin',
  checkAuth,
  Controller.getNoConfirmedProvidersForAdmin
);

// @route    POST api/add-product-to-provider
// @desc     Add product to provider
// @access   Private
router.post(
  '/add-product-to-provider',
  checkAuth,
  extractImage,
  [
    check('title', 'Titre est requis')
      .not()
      .isEmpty(),
    check('price', 'Prix est requis')
      .not()
      .isEmpty(),
    check('cat', 'Cat est requis')
      .not()
      .isEmpty(),
    check('status', 'Statut est requis')
      .not()
      .isEmpty()
  ],
  Controller.addProductToProvider
);

// @route    POST api/delete-product/:id
// @desc     Del product Authenticated provider
// @access   Private
router.delete(
  '/delete-product/:id',
  checkAuth,
  Controller.deleteProductProvider
);

// @route    POST api/product-for-current-provider/:id
// @desc     Get product for current provider
// @access   Private
router.post(
  '/product-for-current-provider/:id',
  checkAuth,
  Controller.getProductByIDForCurrentProvider
);

// @route    POST api/get-products-for-current-provider
// @desc     Get all products for current provider
// @access   Private
router.post(
  '/get-products-for-current-provider',
  checkAuth,
  Controller.getProductsForCurrentProvider
);

// @route    POST api/get-products-for-current-provider
// @desc     Get all products for current provider
// @access   Private
router.post(
  '/get-products-for-user-by-id-provider/:id',
  checkAuth,
  Controller.getProductsForUserByIDProvider
);

// @route    POST api/get-products-for-current-provider
// @desc     Get all products for current provider
// @access   Private
router.post(
  '/change-delivery-time-for-provider',
  checkAuth,
  Controller.changeDeliveryTimeForProvider
);

// @route    POST api/update-product-to-current-provider/:id
// @desc     Update product to current provider
// @access   Private
router.post(
  '/update-product-to-current-provider/:id',
  checkAuth,
  extractImage,
  [
    check('title', 'Titre est requis')
      .not()
      .isEmpty(),
    check('price', 'Prix est requis')
      .not()
      .isEmpty(),
    check('desc', 'Desc est requis')
      .not()
      .isEmpty(),
    check('cat', 'Cat est requis')
      .not()
      .isEmpty(),
    check('status', 'Statut est requis')
      .not()
      .isEmpty()
  ],
  Controller.updateProductToCurrentProvider
);

// @route    POST api/get-user-by-id-for-admin
// @desc     Get user object by id for admin
// @access   Private
router.post(
  '/get-user-by-id-for-admin',
  checkAuth,
  Controller.returnUserObjectByIDForAdmin
);

// @route    POST api/sign-up
// @desc     Register user
// @access   Public
router.post(
  '/update-user-by-id-for-admin/:id',
  checkAuth,
  extractImage,
  Controller.updateUserByIdForAdmin
);

// @route    POST api/delete-user/:id
// @desc     Delete user by admin
// @access   Private
router.delete('/delete-user/:id', checkAuth, Controller.deleteUserByAdmin);

// @route    POST api/confirm-provider-by-id-for-admin
// @desc     Confirm provider by id for admin
// @access   Private
router.post(
  '/confirm-provider-by-id-for-admin',
  checkAuth,
  Controller.confirmProviderByID
);

// @route    POST api/change-product-status
// @desc     change-product-status
// @access   Private
router.post(
  '/change-product-status/:id',
  checkAuth,
  Controller.changeProductStatus
);

// @route    POST api/change-product-status
// @desc     change-product-status
// @access   Private
router.post('/update-gps', checkAuth, Controller.updateGPS);

// @route    POST api/create-payment
// @access   Public
router.post(
  '/create-payment',
  checkAuth,
  [
    check('amount', 'amount est requis')
      .not()
      .isEmpty(),
    check('currency', 'currency est requis')
      .not()
      .isEmpty(),
    check('description', 'description est requis')
      .not()
      .isEmpty(),
    check('card_id', 'card_id est requis')
      .not()
      .isEmpty(),
    check('provider_id', 'provider_id est requis')
      .not()
      .isEmpty(),
    check('provider_name', 'provider_name est requis')
      .not()
      .isEmpty(),
    check('product_id', 'product_id est requis')
      .not()
      .isEmpty()
  ],
  Controller.createPayment
);

// @route    POST api/get-current-orders-history
// @access   Public
router.post(
  '/get-current-orders-history',
  checkAuth,
  Controller.getCurrentOrdersHistory
);

// @route    POST api/get-current-orders-history
// @access   Public
router.post(
  '/get-contact-cmd-for-provider',
  checkAuth,
  Controller.getContactCmdForProvider
);

// @route    POST api/get-current-orders-history
// @access   Public
router.post(
  '/get-full-name-by-id/id',
  checkAuth,
  Controller.getFullNameByID
);




module.exports = router;
