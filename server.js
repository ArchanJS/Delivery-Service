const express=require('express');
require('dotenv').config({path:"./config.env"});
const cors=require('cors');
const morgan=require('morgan');
const bodyParser=require('body-parser');
const port=process.env.PORT;
const app=express();
require('./db/conn');

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json({limit:"50mb"}));
app.use(bodyParser.urlencoded({extended:true,limit:"50mb"}));

app.use('/api/auth/user',require('./routes/authUser'));
app.use('/api/auth/admin',require('./routes/authAdmin'));
app.use('/api/auth/deliveryperson',require('./routes/authDP'));
app.use('/api/private/user',require('./routes/privUser'));
app.use('/api/private/admin',require('./routes/privAdmin'));
app.use('/api/private/deliveryperson',require('./routes/privDP'));

app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`);
})