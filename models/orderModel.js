const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  products: [{
    type: mongoose.ObjectId,
    ref: 'Products',
  }],
  payment: {},
  buyer: {
    type: mongoose.ObjectId,
    ref: 'Users',
  },
  status:{
    type:String,
    default:'Not process',
    enum:['Not process','Processing','Shipping','Delivered','Cancel'],
  },
},{timestamps:true});
module.exports = mongoose.model("Order", orderSchema);