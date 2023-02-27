import express from 'express';
import User from '../models/user';

import jsonwebtoken from 'jsonwebtoken';
import { hashSync, genSaltSync, compareSync } from "bcrypt";
import cookieParser from 'cookie-parser';

import userRouter from './user';

const router = express.Router();


/* 
See: 

https://devdotcode.com/complete-jwt-authentication-and-authorization-system-for-mysql-node-js-api/ 

*/

router.use(cookieParser());

router.post('/register', async (req, res, next)=>{
    try{
        const userName = req.body.userName;
        const email = req.body.email;
        let password = req.body.password;
  
  
              if (!userName || !email || !password) {
                return res.sendStatus(400);
             }
  
             const salt = genSaltSync(10);
             password = hashSync(password, salt);
  
               
  
        const user =  await User.insertUser(email, password);
         
        const jsontoken = jsonwebtoken.sign({user: user}, process.env.SECRET_KEY, { expiresIn: '30m'} );
        res.cookie('token', jsontoken, { httpOnly: true, secure: true, expires: new Date(Number(new Date()) + 30*60*1000) }); //we add secure: true, when using https.
 
 
        res.json({token: jsontoken});
   
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


export default router;