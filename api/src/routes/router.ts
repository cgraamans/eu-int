import express from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { hashSync, genSaltSync, compareSync } from "bcrypt";
import cookieParser from 'cookie-parser';

import db from "../services/db";

import User from '../models/user';

import userRouter from './user';

/* 
See: 

https://devdotcode.com/complete-jwt-authentication-and-authorization-system-for-mysql-node-js-api/ 

*/

// INIT
const router = express.Router();

router.use(cookieParser());

// REGISTER
router.post('/register', async (req, res, next)=>{
    try{

        const name = req.body.username;
        const email = req.body.email?req.body.email:null;
        let password = req.body.password;
  
        // VALIDATE

        if (!name || !password) {
            return res.status(400).json({
                error: "Name and password required"
            });
        }

        const isUser = await User.getUserByName(name);
        if (isUser.length > 0) {
            return res.status(400).json({
                error: "Username taken"
            });
        }

        if(name.length > 64) {
            return res.status(400).json({
                error: "Username too long"
            });
        }

        if(!email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            return res.status(400).json({
                error: "Invalid email"
            });    
        }

        // PROCESS

        // Create password and secret
        password = hashSync(password, genSaltSync(10));
        const secret = hashSync(Math.random().toString(), genSaltSync(10));
  
        // INS USER
        const userId =  await User.insertUser(name, password,email).catch(e=>console.log(e));
        if(!userId || userId < 1) res.status(400).json({
            error: "BAD USER INSERT. CONTACT ADMINS."
        });

        console.log(userId);

        // INS JWT
        const jsontoken = jsonwebtoken.sign({user: userId}, process.env.SECRET_KEY, { expiresIn: '30m'} );

        const isTokenStored = await User.insertUserToken(userId,jsontoken,new Date().getTime()).catch(e=>console.log(e));
        if(!isTokenStored || isTokenStored < 1) res.status(400).json({
            error: "BAD USER TOKEN INSERT. CONTACT ADMINS."
        });

        // INS ROLES
        // const isUserRoleStored = await User.insertUserRole(userId,1).catch(e=>console.log(e));

        // RESPONSE
        res.cookie('token', jsontoken, { httpOnly: true, secure: true, expires: new Date(Number(new Date()) + 30*60*1000) }); //we add secure: true, when using https.
        res.json({token: jsontoken,user:{name:name,roles:['User']}});
   
        next();

    } catch(e){    
        console.log(e);
        res.sendStatus(400);
    }
});
 
 
 
 
 router.post('/login', async(req, res, next)=>{
    try{
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.getUserByEmail(email);
     
    if(!user){
        return res.json({
            message: "Invalid email or password"
        })
    }
 
    const isValidPassword = compareSync(password, user.password);
    if(isValidPassword){
        user.password = undefined;
        const jsontoken = jsonwebtoken.sign({user: user}, process.env.SECRET_KEY, { expiresIn: '30m'} );
        res.cookie('token', jsontoken, { httpOnly: true, secure: true, expires: new Date(Number(new Date()) + 30*60*1000) }); //we add secure: true, when using https.
 
        res.json({token: jsontoken});
 
    }  else{
        return res.json({
            message: "Invalid email or password"
        });
    } 
 
    next();

    } catch(e){
        console.log(e);
    }
});

//  Verify Token
async function  verifyToken (req:any, res:any, next:any){
    
    const token=req.cookies.token;
     console.log(token);
      
     if(token === undefined  ){
          
             return res.json({
                 message: "Access Denied! Unauthorized User"
               });
     } else{
  
         jsonwebtoken.verify(token, process.env.SECRET_KEY, (err:any, authData:any)=>{
             if(err){
                 res.json({
                     message: "Invalid Token..."
                   });
  
             } else{
                 
                console.log(authData.user.role);
                const role = authData.user.role;
                if(role === "admin"){
  
                 next();
                } else{
                    return res.json({
                        message: "Access Denied! you are not an Admin"
                      });
  
                }
             }
         })
     } 
 }
  
router.use('/user', verifyToken, userRouter);

router.get("/",async(req,res,next)=>{
    res.sendStatus(200);
    next();
})

export default router;