const express=require('express');
const {authUser}=require('../middlewares/auth');
const Item = require('../models/Item');

const router=express.Router();

router.get('/',authUser,async(req,res)=>{
    try {
        res.status(200).send(req.user);
    } catch (error) {
        res.status(401).json({error:"Something went wrong!"});
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
            let itemID = "i";
            const charactersLength = characters.length;

            while (true) {
                for (var i = 0; i < 5; i++) {
                    itemID += characters.charAt(Math.floor(Math.random() * charactersLength));
                }

                let checkItem = await Item.findOne({ itemID });
                if (checkItem != null) {
                    itemID = "i";
                    continue;
                } else {
                    break;
                }
            }
        // console.log(pickupLocations);
            const item=new Item({items,itemID,customerID,pickupLocations});
        // console.log(item);
            await item.save();
            res.status(201).json({message:"Task created!"});
    } catch (error) {
        res.status(400).json({error:"Something went wrong!"});
    }
})

module.exports=router;