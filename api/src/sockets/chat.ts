import Joi from "joi";
import {EUINT} from "../../types";

module.exports = {
    run: async (socket:EUINT.ExtendedSocket,event:string,args:{orderBy?:string,limit?:number,orderDir?:string})=>{

        return socket;

    }
}