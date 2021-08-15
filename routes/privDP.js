const express=require('express');
const {authDP}=require('../middlewares/auth');
const Order=require('../models/Order');

const router=express.Router();

router.get('/',authDP,async(req,res)=>{
    try {
        res.status(200).send(req.dp);
    } catch (error) {
        res.status(401).json({error:"Something went wrong!"});
    }
})

router.get('/ownorders',authDP,async(req,res)=>{
    try {
        const orders=await Order.find({dpID:req.dp.userID});
        res.status(200).send(orders);
    } catch (error) {
        res.status(500).json({error:"Something went wrong!"});
    }
})

router.patch('/updatestatus',authDP,async(req,res)=>{
    try {
        const {orderID,status}=req.body;
        const order=await Order.findOne({orderID});
        if(order.dpID!=req.dp.userID) res.status(400).json({error:"You can not update this order's status!"});
        else{
            await Order.updateOne({orderID},{
                $set:{
                    status
                }
            })
        }
        res.status(200).json({message:"Order's status updated!"});
    } catch (error) {
        res.status(500).json({error:"Something went wrong!"});
    }
})

module.exports=router;