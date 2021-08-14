const mongoose=require('mongoose');

const itemSchema= new mongoose.Schema({
    items:[{
        item:String,
        quantity:String,
        category:String
    }],
    itemID:{
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
        default:"Task Created."
    }
})

const Item=new mongoose.model("items",itemSchema);

module.exports=Item;