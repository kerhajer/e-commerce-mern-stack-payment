const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    productDetails: {
        type: Array,
        default: []
    },
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    
      },
    email: {
        type: String,
        default: '',
    },
    paymentDetails: {
        paymentId: {
            type: String,
            default: ''
        },
        payment_method_type: {
            type: [String],
            default: []
        },
        payment_status: {
            type: String,
            default: ''
        },
        shipping_option: {
            type: [String],
            default: []
        },
        totalAmount: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("order", orderSchema)