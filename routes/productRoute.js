const express = require ('express');
const { requireSignIn, isAdmin } = require('../middlewares/authMiddleware');
const { createProductController,productController,singleProductController,productPhotoController,deleteProductController,updateProductController,filterProductController,countProductController,listProductController,searchProductController,relatedProductController,productCategoryController,braintreeTokenController,braintreePaymentController } = require('../controllers/productController');
const formiable = require('express-formidable');
const { count } = require('../models/userModel');

const router = express.Router();

//create product
router.post('/create-product',requireSignIn,isAdmin,formiable(),createProductController)

//get product
router.get('/get-product',productController)

//get single product
router.get('/single-product/:slug',singleProductController)

//get photo
router.get('/product-photo/:pid',productPhotoController)

//delete product
router.delete('/delete-product/:pid',deleteProductController)

//update product
router.put('/update-product/:pid',requireSignIn,isAdmin,formiable(),updateProductController)

//filter product
router.post('/product-filters',filterProductController)

//product count
router.get('/product-count',countProductController)

//product list
router.get('/product-list/:page',listProductController)

//search product
router.get('/search/:keyword',searchProductController)

//related product
router.get('/related-product/:pid/:cid',relatedProductController)

//category wise product
router.get('/product-category/:slug',productCategoryController)

//payment gateway api
//token
router.get('/braintree/token',braintreeTokenController)

//payment
router.post('/braintree/payment',requireSignIn,braintreePaymentController)

module.exports = router;