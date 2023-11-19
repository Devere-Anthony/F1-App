const express = require('express');
const router = express.Router();
const uuid = require('uuid')
const products = require('../models/products');
const clientOrders = require('../models/clientOrders');
const stockOrders = require('../models/stockOrders')

// Home Page
router.get('/', async (req, res) => {
    try {
        const allProducts = await products.find();
        const allClientOrders = await clientOrders.find();
        const allStockOrders = await stockOrders.find();
        res.render('index', { products: allProducts, clientOrders: allClientOrders, stockOrders: allStockOrders });
    } catch (error) {
        console.log(error);
    }
});

// Add Product Page messages
router.get('/addProduct', async (req, res) => {
    const messages = await req.consumeFlash('info');
    res.render('addProduct', messages);
});

// Add Product POST Route
// Add Product POST Route
router.post('/addProduct', async (req, res) => {
    console.log(req.body);

    const newProduct = new products({
        productID: uuid.v4(),
        productName: req.body.productName,
        barcode: req.body.barcode,
        category: req.body.category,
        retail: req.body.retail,
        wholesale: req.body.wholesale,
        quantity: req.body.quantity,
        autorestock: req.body.autorestock,
        maxstock: req.body.maxstock,
        minstock: req.body.minstock,
    });

    // Explicitly validate the newProduct before attempting to save it
    const validationError = newProduct.validateSync();

    if (validationError) {
        // Handle validation error here
        console.error(validationError);
        // You can return an error message or redirect back to the form with an error message.
        res.render('addProduct', { errors: validationError.errors });
    } else {
        try {
            await newProduct.save();
            res.redirect('/');
        } catch (error) {
            console.error(error);
            res.render('addProduct', { errors: error });
        }
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
            autorestock: req.body.autorestock,
            maxstock: req.body.maxstock,
            minstock: req.body.minstock,
        });
        res.redirect(`/`);
    } catch (error) {
        console.log(error);
    }
});

// Stock Order
router.get('/stockOrders', async (req, res) => {
    try {
        // Get Stock Order info
        const allStockOrders = await stockOrders.find();
        res.render('stockOrders', { stockOrders: allStockOrders });
    } catch (error) {
        console.log(error);
    }
});

// Stock Order POST Route
router.post('/stockOrders/:productID', async (req, res) => {
    try {
        // Get Product info
        const currentProductDetails = await products.findOne({ productID: req.params.productID });

        // Project new quantity
        const projectedStockQuantity = currentProductDetails.quantity + req.body.sorderquantity;

        // Update product document data with projected stock quantity
        currentProductDetails.projectedStockQuantity = projectedStockQuantity;
        await currentProductDetails.save(); // Save the updated product document

        res.redirect('/');
    } catch (error) {
        console.log(error);
    }
});

// Client Order
router.get('/clientOrders', async (req, res) => {
    try {
        const allClientOrders = await clientOrders.find();
        res.render('clientOrders', { clientOrders: allClientOrders });
    } catch (error) {
        console.log(error);
    }
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

// Fix this post route such that it allows for multiple client orders to update the projectedStockQuantity with multiple client orders
router.post('/fulfillOrder', async (req, res) => {
    console.log(req.body);

    try {
        // Step 1: Get product info
        const currentProductDetails = await products.findOne({ productID: req.body.productID });

        if (!currentProductDetails) {
            return res.sendStatus(404);
        }

        // Step 2: Project new quantity
        const projectedStockQuantity = currentProductDetails.quantity - req.body.corderquantity;

        /* Here is where we shouldn't allow for invalid orders, 
           so if the customer order quantity is greater than the current quantity,
           then the order can't be fulfilled and we need to handle this issue
           before allowing garbage data to populate the data store
        */
        if (projectedStockQuantity < 0) {
            res.redirect('/');
            console.log("false");
            return false;
        }

        // Step 3: Fulfill order by saving a new fulfillment record
        const newclientOrder = new clientOrders({
            clientorderID: uuid.v4(),
            productID: req.body.productID,
            corderquantity: req.body.corderquantity,
            date: req.body.date,
            quantity: projectedStockQuantity, // Update the quantity field with projectedStockQuantity
        });

        await newclientOrder.save();

        // Step 4: Update product document data with projected stock quantity
        currentProductDetails.projectedStockQuantity = projectedStockQuantity;
        await currentProductDetails.save(); // Save the updated product document

        // Step 5: Create a new stockOrders object when necessary
        if (currentProductDetails.autorestock === 'enabled' && projectedStockQuantity <= currentProductDetails.minstock) {
            const newStockOrder = new stockOrders({
                stockorderID: uuid.v4(),
                date: new Date(),
                productID: req.body.productID,
                sorderquantity: currentProductDetails.maxstock - projectedStockQuantity,
            });
            await newStockOrder.save();
        }
        res.redirect('/');
        console.log("true")
        return true
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});




module.exports = router;