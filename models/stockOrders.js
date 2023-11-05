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
    date: {
        type: Date,
        default: () => Date.now(),
    }
});

module.exports = mongoose.model('stockOrders', stockOrdersSchema);