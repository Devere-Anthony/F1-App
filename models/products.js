const mongoose = require('mongoose');

// Conditions have been met but does not notify user through UI
const Schema = mongoose.Schema;
const productsSchema = new Schema({
    productID: {
        type: String,
        unique: true,
        minLength: [3, "Must be at least 3 characters"],
        maxLength: 20,
        immutable: true
    },
    productName: {
        type: String,
        unique: [true, "Name must be unique"],
        minLength: [3, "Must be at least 3 characters"],
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
        validate: {
            validator: function (value) {
                // Validate that 'quantity' is less than or equal to 'max'
                return value <= this.max;
            },
            message: 'Quantity must not exceed the maximum allowed quantity.'
        }
    },
    autorestock: {
        type: String,
    },
    max: {
        type: Number,
        min: 1,
        max: 100,
        default: 100,
        validate: {
            validator: function (value) {
                // Validate that 'max' is greater than or equal to 'min'
                return value >= this.min;
            },
            message: 'Max threshold must be greater than the minimum threshold.'
        }
    },
    min: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// schema model
const products = mongoose.model('products', productsSchema);
module.exports = products;