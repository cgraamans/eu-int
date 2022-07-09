import Joi from "joi";
import {EUINT} from "../../../types";

const userSchema = Joi.object({
    username: Joi.string().max(32).required(),
    token: Joi.string().max(64).required()
});

module.exports = {
    run: async (socket:EUINT.ExtendedSocket,event:string,args:{orderBy?:string,limit?:number,orderDir?:string})=>{

        return socket;

    }
}

// socket.on("message:private", (anotherSocketId, msg) => {
//     socket.to(anotherSocketId).emit("message:private", socket.id, msg);
//   });