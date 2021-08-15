const express = require('express');
const Admin = require('../models/Admin');
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
            let userID = "a";
            const charactersLength = characters.length;

            while (true) {
                for (var i = 0; i < 5; i++) {
                    userID += characters.charAt(Math.floor(Math.random() * charactersLength));
                }

                let checkAdmin = await Admin.findOne({ userID });
                if (checkAdmin != null) {
                    userID = "a";
                    continue;
                } else {
                    break;
                }
            }

            const admin = new Admin({ name, userID, phone, password });
            await client.verify.services(process.env.SERVICE_ID).verifications.create({
                to: `+91${phone}`,
                channel: "sms",
            })
            await admin.save();
            res.status(201).json({ message: "User created! Now verify phone no.!" });
        }
        else {
            res.status(400).json({ error: "Please enter all the details!" });
        }
    } catch (error) {
        res.status(500).json({ error: "Something went wrong!" });
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
                const admin=await Admin.findOne({phone});
                if(admin.verified==false){
                    let verified = true;
                    await Admin.updateOne({ phone }, {
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
        res.status(500).json({ error: "Something went wrong!" });
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
            const admin=await Admin.findOne({phone});
            console.log("hi2");
            if(!admin){
                res.status(400).json({ error: "User not found!" });
            }
            else if(admin.verified==false){
                res.status(401).json({error:"User is not verified!"});
            }
            else{
                const checkPass=await admin.comparePasswords(password);
                console.log("hi3");
                if(!checkPass){
                    res.status(400).json({error:"Invalid credentials!1"});
                }
                else{
                    console.log("hi4");
                    const token = await admin.generateToken();
                    res.status(200).send(token);
                    console.log(admin);
                }
            }
        }

    } catch (error) {
        res.status(500).json({ error: "Something went wrong!" });
    }
})

module.exports=router;