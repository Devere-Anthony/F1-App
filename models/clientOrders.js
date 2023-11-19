const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const corderValidator = function (value) {
    return value >= 0 && value <= this.quantity;
};


const clientOrdersSchema = new Schema({
    clientorderID: {
        type: String,
    },
    productID: {
        type: String,
        ref: 'products'
    },
    corderquantity: {
        type: Number,
        validate: [corderValidator, 'Order quantity must be less than the current stock quantity']
    },
    quantity: {
        type: Number,
        ref: 'products'
    },
    date: {
        type: Date,
        default: () => Date.now(),
    }
});

const clientOrders = mongoose.model('clientOrders', clientOrdersSchema);
module.exports = clientOrders;