const createError= require('http-errors');
const User = require('../model/user');
const reftoken = require('../model/reftokens');
const { required } = require('@hapi/joi');
const {authSchema} = require('../helper/validate');
const {signAccessToken,signRefreshToken}=require('../helper/jwt_helper');


module.exports = {
    register : async(req,res,next)=>{
        try {
           const {email,password} = req.body
            const result = await authSchema.validateAsync(req.body)
        //    if(!email || !password) throw createError.BadRequest("bad request")
         const exist =  await User.findOne({email: result.email})
         if(exist)   throw createError.Conflict(`${result.email} is already present`)
         
         const user = new User({email:result.email,password:result.password});
          
         await user.save()
         .then(async(saveduser)=>{
            // res.send(saveduser);
            const accessToken = await signAccessToken(saveduser.id);
            const refreshToken = await signRefreshToken(saveduser.id);
            res.send({accessToken,refreshToken})
         })
         .catch((err)=>{
             console.log(err.message)
             throw createError.Conflict("failed in saving user")
        })
    
       
         
        } catch (error) {
            if(error.isJoi === true)  error.status= 422
            next(error)
        }
    },
    login:async(req,res,next)=>{
        try {
          const result = await authSchema.validateAsync(req.body)
          const user = await User.findOne({email:result.email})
          console.log(user);
          if(!user) throw createError.NotFound("user not registered")
            const isMatch = await user.isValidPassword(result.password)
            console.log(isMatch);
            if(!isMatch) throw createError.Unauthorized('Username/password incorrect')
            const accessToken = await signAccessToken(user.id);
            const refreshToken = await signRefreshToken(user.id);
            res.send({accessToken,refreshToken})
        } catch (error) {
            if(error.isJoi===true) return next(createError.BadRequest("invalid username/password"))
            next(error)
        }
    },
    refreshToken:async(req,res,next)=>{
        try {
           let {refreshToken} = req.body
           if(!refreshToken) throw createError.BadRequest();
          const userid =  await verifyRefreshToken(refreshToken);
          const accessToken= await signAccessToken(userid);
           refreshToken=await signRefreshToken(user.id);
          res.send({accessToken,refreshToken});
        } catch (error) {
            
        }
    },
    logout:async(req,res,next)=>{
        try {
           const {refreshToken} = req.body
           if(!refreshToken) throw createError.BadRequest()
           const userid= await verifyRefreshToken(refreshToken);
           refreshtoken.deleteOne({ userid: userid },  (err,value) =>{
            if (err) return createError.InternalServerError()
            console.log(value);
            res.sendStatus(204)
          })
        } catch (error) {
            next(err)
        }
    }
}