const express=require('express');
const {authAdmin}=require('../middlewares/auth');
const DeliveryPerson=require('../models/DeliveryPerson');
const Order=require('../models/Order');

const router=express.Router();

router.get('/',authAdmin,async(req,res)=>{
    try {
        res.status(200).send(req.admin);
    } catch (error) {
        res.status(500).json({error:"Something went wrong!"});
    }
})

router.get('/alldps',authAdmin,async(req,res)=>{
    try {
        const dps=await DeliveryPerson.find();
        res.status(200).send(dps)
    } catch (error) {
        res.status(500).json({error:"Something went wrong!"});
    }
})

router.get('/allorders',authAdmin,async(req,res)=>{
    try {
        const orders=await Order.find();
        res.status(200).send(orders)
    } catch (error) {
        res.status(500).json({error:"Something went wrong!"});
    }
})

router.get('/filteredorders',authAdmin,async(req,res)=>{
    try {
        const {status}=req.body;
        const orders=await Order.find({status});
        res.status(200).send(orders);
    } catch (error) {
        res.status(500).json({error:"Something went wrong!"});
    }
})

router.patch('/assigndp',authAdmin,async(req,res)=>{
    try {
        const {orderID,dpID}=req.body;
        const dp=await DeliveryPerson.findOne({userID:dpID});
        if(!dp) res.status(400).json({error:"Delivery person doesn't exist!"});
        else{
            const order=await Order.findOne({orderID});
            if(!order) res.status(400).json({error:"Order doen't exist!"});
            else{
                await Order.updateOne({orderID},{
                    $set:{
                        dpID
                    }
                })
            }
        }
        res.status(200).json({message:"Delivery person assigned!"});
    } catch (error) {
        res.status(500).json({error:"Something went wrong!"});
    }
})

module.exports=router;