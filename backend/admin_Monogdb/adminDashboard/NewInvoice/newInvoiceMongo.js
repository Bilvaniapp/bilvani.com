const mongoose = require("mongoose");
const { type } = require("os");


const invoiceSchema = new mongoose.Schema({
  invoiceType: { type: String, required: true, enum: ["GST", "Without GST"] },
  invoiceNo: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
  placeOfSupply: { type: String, required: true },
  billingType: {
    type: String,
    required: true,
    enum: ["Cash A/C", "Client A/C"],
  },
  contactNo: { type: String, required: true },
  clientName: { type: String, required: true },
  address: { type: String, required: true },
  clientGSTIN: { type: String, required: false }, // Optional for Without GST
  soldBy: { type: String, },
  
  paymentStatus: {
    type: String,
    required: true,
    enum: ["Paid", "Pending"],
    default: "Pending",
  }, 
  particulars: [
    {
      srno:{type:Number},
      itemName: { type: String, required: true },
      quantity: { type: Number, required: true },
      salePrice: { type: Number, required: true },
      discountPercent: { type: Number, default: 0 },
      taxPercent: { type: Number, default: 0 },
      gstamount:{type:String},
      amount: { type: Number, required: true },
     
    },
  ],

  deliveryTerms: { type: String, required: false },
  totalamount:{type:String},
  receivedDate:{ type: Date || null},
  token:{
    type:String
  }
});

module.exports = mongoose.model("AdminInvoice", invoiceSchema);
