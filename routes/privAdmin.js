const express=require('express');
const {authAdmin}=require('../middlewares/auth');

const router=express.Router();

router.get('/',authAdmin,async(req,res)=>{
    try {
        res.status(200).send(req.admin);
    } catch (error) {
        res.status(401).json({error:"Something went wrong!"});
    }
})

module.exports=router;