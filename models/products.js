const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const quantityValidator = function (value) {
    return value >= 0 && value <= this.maxstock;
};

const maxstockValidator = function (value) {
    return value >= 0 && value >= this.minstock;
};

const productsSchema = new Schema({
    productID: {
        type: String,
        immutable: true
    },
    productName: {
        type: String,
        minLength: [3, 'Must be at least 3 characters'],
        maxLength: 20
    },
    barcode: {
        type: String,
    },
    category: {
        type: String,
        enum: {
            values: ["Light Roast", "Medium Roast", "Dark Roast"]
        },
    },
    retail: {
        type: String,
        min: 0,
    },
    wholesale: {
        type: String,
        min: 0,
    },
    quantity: {
        type: Number,
        validate: [quantityValidator, 'Quantity must be between 0 and maximum threshold']
    },
    projectedStockQuantity: {
        type: Number,
    },
    autorestock: {
        type: String,
    },
    maxstock: {
        type: Number,
        min: 1,
        max: 100,
        validate: [maxstockValidator, 'Maximum value must be greater that minimum threshold']
    },
    minstock: {
        type: Number,
        min: 0,
        max: 100,
    }
});


// schema model
const products = mongoose.model('products', productsSchema);
module.exports = products;