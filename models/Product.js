const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    cost: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        default: 0
    },
    purchaseDate: {
        type: Date,
        required: true
    },
    saleDate: {
        type: Date,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product