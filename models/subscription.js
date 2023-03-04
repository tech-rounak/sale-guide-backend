const mongoose = require('mongoose');

const subscribeSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,'Please add valid Email']
    },
    productLink:{
        type:String,
        required:[true,'Please add valid Product Link']
    },
    productName:{
        type:String,
    },
    price:{
        type:Number,
        required:[true,'please add a price']
    },
    isActive:{
        type:Boolean,
        default:true
    }
})

module.exports = mongoose.model('subscribe',subscribeSchema);