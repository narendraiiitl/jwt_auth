const { required } = require("@hapi/joi");
const reftoken = require('../model/reftokens');
const jwt= require('jsonwebtoken')
const createError = require("http-errors")
require('dotenv').config();
module.exports = {
    signAccessToken:(userid)=>{
        return new Promise((resolve,reject)=>{
            const payload = {
               
            }
         const secret = process.env.accessTokenSecret
         const option={
            expiresIn:"1h",
            issuer:"nsn",
            audience:userid
         }
         jwt.sign(payload,secret,option,(err,token)=>{
             if(err) 
             {
                 console.log(err.message);

               return reject(createError.InternalServerError())
             }   
             resolve(token)
         })
        })
    },
    verifyAccessToken:(req,res,next)=>{
        if(!req.headers['authorization']) return next(createError.Unauthorized())
        const authHeader = req.headers['authorization'].split(' ');
        const token = authHeader[1];
        jwt.verify(token,process.env.accessTokenSecret,(err,payload)=>{
            if(err.name==='JsonWebTokenError') return next(createError.Unauthorized())
            else{
                return next(createError.Unauthorized(err.message))
            }
            req.payload=payload
            next();
        })
    },
    signRefreshToken:(userid)=>{
        return new Promise((resolve,reject)=>{
            const payload = {
               
            }
         const secret = process.env.refreshTokenSecret
         const option={
            expiresIn:"1y",
            issuer:"nsn",
            audience:userid
         }
         jwt.sign(payload,secret,option,async (err,token)=>{
             if(err) 
             {
                 console.log(err.message);

               return reject(createError.InternalServerError())
             }   
          const Tok =  await reftoken.findOneAndUpdate({userid:userid}, {$set:{refreshToken:token}}, {new: true}, (err, doc) => {
                if (err) {
                    console.log("Something wrong when updating data!");
                }
            
                console.log(doc);
            });
            console.log(Tok)
            if(!Tok)
            {
                const refresh = new reftoken({userid:userid,refreshToken:token});
                await refresh.save()
                .then((savedtoken)=>{
                    console.log(savedtoken)
                })
                .catch((err)=>{
                    console.log(err.message)
                    throw createError.Conflict("failed in saving refersh token")
                })
            }
             resolve(token)
         })
        })
    },
    verifyRefreshToken:(refreshToken)=>{
        return new Promise((resolve,reject)=>{
            JWT.verify(refreshToken,process.env.refreshTokenSecret,async(err,payload)=>{
                if(err) return reject(createError.Unauthorized())
                const userid = payload.aud 
                const user = await reftoken.find({userid:userid},(err,usr)=>{
                    if(err) {
                        console.log(err.message)
                        reject(createError.InternalServerError())
                        return
                    }
                    console.log(usr)
                })
                if(user.refreshToken === refreshToken)
                resolve(userid)
                else{
                    reject(createError.Unauthorized())
                }
            })
        })
    }
}