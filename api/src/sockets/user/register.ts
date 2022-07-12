import Joi from "joi";
import {EUINT} from "../../../types";
import bcrypt from 'bcrypt';
import { db } from "../../../src/services/db";
import { generateSlug } from 'random-word-slugs';
import { v4 as uuidv4 } from 'uuid';

const userSchema = Joi.object({
    email: Joi.string().email({minDomainSegments:2}).required(),
    password: Joi.string()
        .pattern(new RegExp('/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/'))
        .max(32)
        .required()
});
const saltRounds = 10;

module.exports = {
    run: async (socket:EUINT.ExtendedSocket,event:string,args:{password:string,email:string})=>{

        console.log("!!! USER:REGISTER");

        if(args.password && args.email) {

            // JOI validation
            const validation = userSchema.validate(args);
            if(validation.error) {
                console.log(validation.error)
                socket.emit(event,{ok:false,error:validation.error});
                return;
            }

            const emailExists = await db.q({text:"SELECT name FROM users WHERE email = $1",values:[args.email]}).catch(e=>{
                console.log(e);
            });
            if(emailExists && emailExists.rowCount > 0) {
                console.log("duplicate email");
                socket.emit(event,{ok:false,error:"Email already exists."});
                return;
            }

            const user = {
                name:generateSlug(),
                nick:generateSlug(),
                email:args.email,
            };

            console.log("user",user);

            const passwordEncrypted = await bcrypt.hash(args.password, saltRounds).catch(e=>{
                console.log(e);
            });

            console.log("passwordEncrypted",passwordEncrypted);

            const ins = await db.q({text:"INSERT INTO users (name,nick,email,password) VALUES($1,$2,$3,$4) RETURNING id;",values:[
                user.name,
                user.nick,
                args.email,
                passwordEncrypted
            ]}).catch(e=>{
                console.log(e)
            });

            if(!ins || !ins.rowCount || ins.rowCount.length < 1) return;

            const token = await bcrypt.hash(uuidv4(),saltRounds).catch(e=>{
                console.log(e);
            });;
            const insToken = await db.q({text:"INSERT INTO user_tokens (user_id,date_created,date_expired,token,is_api) VALUES($1,$2,$3,$4,$5) RETURNING id;",values:[
                ins.rowCount[0].id,
                Math.round((new Date().getTime())/1000),
                Math.round((new Date().getTime())/1000)+(60*60*24*7),
                token,
                false
            ]}).catch(e=>{
                console.log(e)
            });

            console.log("token",token);

            socket.emit(event,{ok:true,user});

        }

    }
}