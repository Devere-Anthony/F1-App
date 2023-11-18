const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const stockOrdersSchema = new Schema({
    stockorderID: {
        type: String,
    },
    productID: {
        type: String,
        ref: 'products',
    },
    sorderquantity: {
        type: Number,
    },
    projectedStockQuantity: {
        type: Number,
        ref: 'products',
    },
    date: {
        type: Date,
        default: () => Date.now(),
    }
});

const stockOrders = mongoose.model('stockOrders', stockOrdersSchema);
module.exports = stockOrders;