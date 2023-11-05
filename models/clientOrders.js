const mongoose = require('mongoose');

const Schema = mongoose.Schema;
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

module.exports = mongoose.model('clientOrders', clientOrdersSchema);