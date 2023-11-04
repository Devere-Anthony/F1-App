const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const clientOrdersSchema = new Schema({
    clientorderID: {
        type: String,
        unique: true,
        minLength: [3, "Must be at least 3 characters"],
        maxLength: 20,
        immutable: true
    },
    productID: {
        type: String,
        ref: 'products',
    },
    corderquantity: {
        type: Number,
        validate: {
            validator: function (value) {
                // Validate that 'order quantity' is less than or equal to current
                return value <= this.quantity;
            },
            message: 'Quantity must not exceed the current quantity.'
        },
    },
    quantity: {
        type: Number,
        ref: 'products',
    },
    date: {
        type: Date,
        default: () => Date.now(),
    }
});

module.exports = mongoose.model('clientOrders', clientOrdersSchema);