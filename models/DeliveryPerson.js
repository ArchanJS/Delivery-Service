const mongoose=require('mongoose');
const bcryptjs=require('bcryptjs');
const jwt=require('jsonwebtoken');

const dpSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    userID:{
        type:String,
        required:true,
        unique:true
    },
    verified:{
        type:Boolean,
        default:false
    },
    phone:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:8
    }
},
    {timestamps:true}
)

dpSchema.pre("save",async function(next){
    try {
        if(this.isModified("password")){
            this.password = await bcryptjs.hash(this.password,10);
        }
        next();
    } catch (error) {
        console.log(error);
    }
})

dpSchema.methods.comparePasswords=async function(password){
    try {
        return await bcryptjs.compare(password,this.password);
    } catch (error) {
        return false;
    }
}

dpSchema.methods.generateToken=async function(){
    try {
        const token=await jwt.sign({_id:this._id},process.env.SECRET_KEY,{expiresIn:process.env.EXPIRES});
        return token;
    } catch (error) {
        throw new Error("Token is not generated!");
    }
}

const DeliveryPerson= mongoose.model("deliverypersons",dpSchema);

module.exports=DeliveryPerson;