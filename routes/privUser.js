const express=require('express');
const {authUser}=require('../middlewares/auth');
const Order = require('../models/Order');

const router=express.Router();

router.get('/',authUser,async(req,res)=>{
    try {
        res.status(200).send(req.user);
    } catch (error) {
        res.status(500).json({error:"Something went wrong!"});
    }
})

router.post('/placeorder',authUser,async(req,res)=>{
    try {
        const {items, allPickupLocations}=req.body;
        const customerID=req.user.userID;
        console.log(1);
        let pickupLocations=[];
        for(let i=0;i<allPickupLocations.length;i++){
            pickupLocations.push(allPickupLocations[i][Math.floor(Math.random()*(allPickupLocations[i].length))]);
        }
        console.log(2);
        const characters ="abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            let orderID = "o";
            const charactersLength = characters.length;

            while (true) {
                for (var i = 0; i < 5; i++) {
                    orderID += characters.charAt(Math.floor(Math.random() * charactersLength));
                }

                let checkOrder = await Order.findOne({ orderID });
                if (checkOrder != null) {
                    orderID = "o";
                    continue;
                } else {
                    break;
                }
            }
        // console.log(pickupLocations);
            const order=new Order({items,orderID,customerID,pickupLocations});
        // console.log(item);
            await order.save();
            res.status(201).json({message:"Order placed!"});
    } catch (error) {
        res.status(500).json({error:"Something went wrong!"});
    }
})

router.get('/ownorders',authUser,async(req,res)=>{
    try {
        const customerID=req.user.userID;
        const orders=await Order.find({customerID});
        res.status(200).send(orders);
    } catch (error) {
        res.status(500).json({error:"Something went wromg!"});
    }
})

module.exports=router;