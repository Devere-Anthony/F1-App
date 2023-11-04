const express = require('express');
const router = express.Router();
const products = require('../models/products');
const clientOrders = require('../models/clientOrders');
const stockOrders = require('../models/stockOrders')

// Home Page
router.get('/', async (req, res) => {
    try {
        const allProducts = await products.find();
        res.render('index', { products: allProducts });
    } catch (error) {
        console.log(error);
    }
});

// Add Product Page messages NEEDS FIXING
router.get('/addProduct', async (req, res) => {
    const messages = await req.consumeFlash('info');
    res.render('addProduct', messages);
});

// Add Product POST Route
router.post('/addProduct', async (req, res) => {
    console.log(req.body);

    const newProduct = new products({
        productID: req.body.productID,
        productName: req.body.productName,
        barcode: req.body.barcode,
        category: req.body.category,
        retail: req.body.retail,
        wholesale: req.body.wholesale,
        quantity: req.body.quantity,
        max: req.body.max,
        min: req.body.min,
        avail: req.body.avail,
    });

    try {
        await newProduct.save();
        await req.flash('info', 'Product added successfully!');
        res.redirect('/');
    } catch (error) {
        console.log(error);
    }
});

// Edit Product Page
router.get('/setStockProduct/:id', async (req, res) => {
    try {
        const product = await products.findOne({ _id: req.params.id });
        res.render('setStockProduct', { products: product });
    } catch (error) {
        console.log(error);
    }
});

// Update Product PUT Route
router.put('/setStockProduct/:id', async (req, res) => {
    try {
        await products.findByIdAndUpdate(req.params.id, {
            productID: req.body.productID,
            productName: req.body.productName,
            barcode: req.body.barcode,
            category: req.body.category,
            retail: req.body.retail,
            wholesale: req.body.wholesale,
            quantity: req.body.quantity,
            max: req.body.max,
            min: req.body.min,
            avail: req.body.avail,
        });
        res.redirect(`/`);
    } catch (error) {
        console.log(error);
    }
});

// Stock Order
router.get('/stockOrders', async (req, res) => {
    res.render('stockOrders');
});

// Fulfill client order page
router.get('/fulfillOrder/:id', async (req, res) => {
    try {
        const product = await products.findOne({ _id: req.params.id });
        res.render('fulfillOrder', { products: product });
    } catch (error) {
        console.log(error);
    }
});

// Fulfill Client Order POST Route
router.post('/fulfillOrder', async (req, res) => {
    console.log(req.body);

    const newclientOrder = new clientOrders({
        clientorderID: req.body.clientorderID,
        productID: req.body.productID,
        corderquantity: req.body.corderquantity,
        quantity: req.body.quantity,
        date: req.body.date,
    });

    try {
        await newclientOrder.save();
        res.redirect('/');
    } catch (error) {
        console.log(error);
    }
});


module.exports = router;