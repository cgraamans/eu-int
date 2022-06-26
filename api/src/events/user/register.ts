import Joi from "joi";
import {EUINT} from "../../../types";

const userSchema = Joi.object({
    username: Joi.string().max(32).required(),
    password: Joi.string().max(32).required()
});

module.exports = {
    run: async (socket:EUINT.ExtendedSocket,event:string,args:{orderBy?:string,limit?:number,orderDir?:string})=>{

        return socket;

    }
}