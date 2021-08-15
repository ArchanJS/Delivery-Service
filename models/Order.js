const mongoose=require('mongoose');

const orderSchema= new mongoose.Schema({
    items:[{
        item:String,
        quantity:String,
        category:String
    }],
    orderID:{
        type:String,
        required:true,
        unique:true
    },
    customerID:{
        type:String,
        required:true
    },
    dpID:{
        type:String
    },
    pickupLocations:[{
        type:String,
        required:true
    }],
    status:{
        type:String,
        default:"Task Created"
    }
})

const Order=new mongoose.model("orders",orderSchema);

module.exports=Order;