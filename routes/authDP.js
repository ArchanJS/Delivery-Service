const express = require('express');
const DeliveryPerson = require('../models/DeliveryPerson');
const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

const router = express();

router.get('/', (req, res) => {
    res.status(201).send("Welcome to home!");
})

router.post('/register', async (req, res) => {
    try {
        const { name, phone, password } = req.body;
        if (name.trim() != "" && phone.trim() != "" && password.trim() != "") {
            const characters ="abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            let userID = "d";
            const charactersLength = characters.length;

            while (true) {
                for (var i = 0; i < 5; i++) {
                    userID += characters.charAt(Math.floor(Math.random() * charactersLength));
                }

                let checkDP = await DeliveryPerson.findOne({ userID });
                if (checkDP != null) {
                    userID = "d";
                    continue;
                } else {
                    break;
                }
            }

            const dp = new DeliveryPerson({ name, userID, phone, password });
            await client.verify.services(process.env.SERVICE_ID).verifications.create({
                to: `+91${phone}`,
                channel: "sms",
            })
            await dp.save();
            res.status(201).json({ message: "User created! Now verify phone no.!" });
        }
        else {
            res.status(400).json({ error: "Please enter all the details!" });
        }
    } catch (error) {
        res.status(400).json({ error: "Something went wrong!" })
    }
})

router.post('/verify', async (req, res) => {
    try {
        const { phone, code } = req.body;
        if (phone.trim() != "" && code.trim() != "") {
            console.log("hi1");
            const data = await client.verify
                .services(process.env.SERVICE_ID)
                .verificationChecks.create({
                    to: `+91${phone}`,
                    code: code,
                })
            if (data.valid === false) {
                res.status(500).json({ error: "Something went wrong!" });
            }
            else {
                const dp=await DeliveryPerson.findOne({phone});
                if(dp.verified==false){
                    let verified = true;
                    await DeliveryPerson.updateOne({ phone }, {
                        $set: {
                            verified
                        }
                    })
                }
                res.status(200).json({message:"User verified"});

            }
        }
        else{
            res.status(400).json({ error: "Please enter all the details!" });
        }
    } catch (error) {
        res.status(400).json({ error: "Something went wrong!" })
    }
})

router.post('/login', async (req, res) => {
    try {
        const { phone, password } = req.body;
        console.log("hi1");
        if(!phone.trim() && !password.trim()){
            res.status(400).json({ error: "Please enter all the details!" });
        }
        else{
            const dp=await DeliveryPerson.findOne({phone});
            console.log("hi2");
            if(!dp){
                res.status(400).json({ error: "User not found!" });
            }
            else if(dp.verified==false){
                res.status(401).json({error:"User is not verified!"});
            }
            else{
                const checkPass=await dp.comparePasswords(password);
                console.log("hi3");
                if(!checkPass){
                    res.status(400).json({error:"Invalid credentials!1"});
                }
                else{
                    console.log("hi4");
                    const token = await dp.generateToken();
                    res.status(200).send(token);
                    console.log(dp);
                }
            }
        }

    } catch (error) {
        res.status(401).json({ error: "Invalid credentials!2" });
    }
})

module.exports=router;