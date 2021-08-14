const express=require('express');
const {authDP}=require('../middlewares/auth');

const router=express.Router();

router.get('/',authDP,async(req,res)=>{
    try {
        res.status(200).send(req.dp);
    } catch (error) {
        res.status(401).json({error:"Something went wrong!"});
    }
})

module.exports=router;