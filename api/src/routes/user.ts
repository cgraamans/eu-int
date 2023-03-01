import * as express from 'express';
import User from '../models/user';
import DB from '../services/db';

const userRouter = express.Router();
 
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
 
userRouter.param('userId', async (req:any, res, next, userId)=> {
    try{
        const user = await DB.getById("User", userId);
        req.user = user;
        next();
    } catch(e) {
        console.log(e);
        res.sendStatus(404);
    }
});
 
userRouter.get('/:userId',  (req:any, res, next)=>{
    res.status(200).json({user: req.user});
    next();
}); 
 
userRouter.post('/',  async (req, res, next)=>{
    try{
        const userName = req.body.user.userName;
        const email = req.body.user.email;
        let password = req.body.user.password;
 
 
              if (!userName || !email || !password) {
                return res.sendStatus(400);
             }
 
             const salt = genSaltSync(10);
             password = hashSync(password, salt);
 
              
 
        const user =  await User.insertUser(email, password);
        res.json({user: user});
            
 
    } catch(e){    
        console.log(e);
        res.sendStatus(400);
    }
});
 
 
 
 
userRouter.put('/:id',  async (req, res, next)=>{
    try{
        const userName = req.body.user.userName;
        const email = req.body.user.email;
        let password = req.body.user.password;
        const userId = req.params.id;
 
 
              if (!userName || !email || !password) {
                return res.sendStatus(400);
             }
 
             const salt = genSaltSync(10);
             password = hashSync(password, salt);
 
              
 
        const user =  await User.updateUser(userName, email, password, userId);
        res.json({message: "user updated" });
            
 
    } catch(e){    
        console.log(e);
        res.sendStatus(400);
    }
});
 
 
 
userRouter.delete('/:id',  async (req, res, next)=>{
    try{
        const userId = req.params.id
        const user =  await User.deleteUser(userId);
        return res.sendStatus(204);
     
    } catch(e){    
        console.log(e);
        res.sendStatus(400);
    }
});
 
 
 
userRouter.get('/', async (req, res, next)=>{
    try {
        const users = await User.allUser();
        res.json({users: users});
    } catch(e) {
        console.log(e);
    }
});
 
 
export default userRouter;