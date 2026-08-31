const mongoose = require('mongoose');

// 1. make schema
const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    qty: Number,
    addedBy: String,
    isInstock: {
        type: Boolean,
        default: true
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
});

// 2. make model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;