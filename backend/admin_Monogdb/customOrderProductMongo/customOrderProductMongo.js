const mongoose = require('mongoose');
const { type } = require('os');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    base: { type: String, required: true },
    type: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
    mixColor: { type: String },
    shade: [
        {
            hex: { type: String },
            shade: { type: String },
            intensity: { type: String }
        }
    ],
    payment: {
        method: { type: String, enum: ['online', 'cash'], required: true },
        paymentId: { type: String }
    },
    confirm: { type: String, enum: ['accepted', 'rejected' ,'pending'], default: "pending" },
    orderComplete: { type: Boolean, default: false },
    coupon: { type: String },
    orderStatus: {
        type: String,
        enum: ['in progress', 'accepted', 'completed', 'rejected'],
        default: 'in progress'
    },
    storeAddress: { type: String, required: true },
    userAddress: { type: String, required: true },
    permanentId:{type:String},
    reasonReject:{type:String},
    phoneNumber:{type:String},
    userName:{type:String},
    fetch:{ type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('customOrderProduct', ProductSchema);
