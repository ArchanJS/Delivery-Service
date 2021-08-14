const User=require('../models/User');
const Admin=require('../models/Admin');
const DeliveryPerson=require('../models/DeliveryPerson');
const jwt=require('jsonwebtoken');

const authUser=async(req,res,next)=>{
    try {
        let token;
        console.log("h1");
        if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(" ")[1];
        }
        console.log("h2");
        console.log(req.headers.authorization);
        if(!token){
            res.status(401).json({error:"User unauthorized1"});
        }
        console.log("h3");
        console.log(token);
        const verifiedToken=await jwt.verify(token,process.env.SECRET_KEY);
        console.log("h4");
        const user= await User.findOne({_id:verifiedToken._id});
        console.log("h5");
        if(!user){
            res.status(401).json({error:"User unauthorized2"});
        }
        console.log("h6");
        req.user=user;
        next();
    } catch (error) {
        res.status(401).json({error:"User unauthorized3"});
        next();
    }
}

const authAdmin=async(req,res,next)=>{
    try {
        let token;
        console.log("h1");
        if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(" ")[1];
        }
        console.log("h2");
        console.log(req.headers.authorization);
        if(!token){
            res.status(401).json({error:"Admin unauthorized1"});
        }
        console.log("h3");
        console.log(token);
        const verifiedToken=await jwt.verify(token,process.env.SECRET_KEY);
        console.log("h4");
        const admin= await Admin.findOne({_id:verifiedToken._id});
        console.log("h5");
        if(!admin){
            res.status(401).json({error:"Admin unauthorized2"});
        }
        console.log("h6");
        req.admin=admin;
        next();
    } catch (error) {
        res.status(401).json({error:"Admin unauthorized3"});
        next();
    }
}

const authDP=async(req,res,next)=>{
    try {
        let token;
        console.log("h1");
        if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(" ")[1];
        }
        console.log("h2");
        console.log(req.headers.authorization);
        if(!token){
            res.status(401).json({error:"Delivery person unauthorized1"});
        }
        console.log("h3");
        console.log(token);
        const verifiedToken=await jwt.verify(token,process.env.SECRET_KEY);
        console.log("h4");
        const dp= await DeliveryPerson.findOne({_id:verifiedToken._id});
        console.log("h5");
        if(!dp){
            res.status(401).json({error:"Delivery person unauthorized2"});
        }
        console.log("h6");
        req.dp=dp;
        next();
    } catch (error) {
        res.status(401).json({error:"Delivery person unauthorized3"});
        next();
    }
}


module.exports={authUser, authAdmin, authDP};