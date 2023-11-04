const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const stockOrdersSchema = new Schema({
    stockorderID: {
        type: String,
        unique: true,
        minLength: [3, "Must be at least 3 characters"],
        maxLength: 20,
        immutable: true
    },
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
    },
    sorderquantity: {
        type: Number,
        validate: {
            validator: function (value) {
                // Calculate the difference between 'max' and 'sorderquantity'
                const difference = this.max - value;
                // Validate that 'sorderquantity' is less than or equal to 'max'
                return difference >= 0;
            },
        },
    },
    max: {
        type: Number,
        ref: 'products',
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

module.exports = mongoose.model('stockOrders', stockOrdersSchema);