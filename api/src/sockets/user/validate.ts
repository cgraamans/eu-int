import Joi from "joi";
import {EUINT} from "../../../types";
import { db } from "../../../src/services/db";

const emailSchema = Joi.object({
    email: Joi.string().email({minDomainSegments:2}).required(),
});
const passwordSchema = Joi.object({
    password: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/))
});

module.exports = {

    run: async (socket:EUINT.ExtendedSocket,event:string,args:{email?:string,password?:string})=>{

        if(args.email) {

            const emailExists = await db.q({text:"SELECT name FROM users WHERE email = $1",values:[args.email]}).catch(e=>{
                console.log(e);
            });
            if(emailExists && emailExists.rowCount > 0) {
                socket.emit(event,{ok:false,error:"duplicate email address",field:"email"});
                return;
            }

            let validation = emailSchema.validate(args);
            if(validation.error) {
                socket.emit(event,{ok:false,error:validation.error.details[0].message,field:"email"});
                return;
            }

            socket.emit(event,{ok:true,field:"email"});

        }

        if(args.password) {

            let validation = passwordSchema.validate(args);
            if(validation.error) {
                socket.emit(event,{ok:false,error:validation.error.details[0].message,field:"password"});
                return;
            }

            socket.emit(event,{ok:true,field:"password"});

        }

        return;

    }

}