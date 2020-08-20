const express= require('express');
const app=express();
const morgan = require('morgan');
const  createError= require('http-errors');
const authroute=require('./routes/authenticate');
const {verifyAccessToken}= require('./helper/jwt_helper');
require('./helper/init_mongoose')
require('dotenv').config();

// const client = require('./helper/init_redis');
// client.set('foo','bar');
// client.get('foo',(err,value)=>{
//     if(err) console.log(err.message)
//     console.log(value);
// })

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.get('/',verifyAccessToken,async(req,res,next)=>{
    try {
        res.send("hello from exress");
    } catch (error) {
        next(err);
    }
})

app.use('/auth',authroute);

app.use(async(req,res,next)=>{
    // const error = new Error('not found')
    // error.status=404
    // next(error)
    next(createError.NotFound('this route doesnot exist'));
})
app.use((err,req,res,next)=>{
    res.status(err.status || 500)
    res.send({
        error:{
            status:err.status || 500,
            message:err.message
        },
    })
})




app.listen(process.env.port,()=>{
    console.log(`listening on port ${process.env.port}`);
})