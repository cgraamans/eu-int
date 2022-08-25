import db from "../services/db";
import Discord from "discord.js";
import reddit from "../services/reddit";
import {Eurobot} from "../../types/index.d"

export default class xp {

    constructor(){}

    public async getByMessage(messageId:string) {

        return await db.q("SELECT * FROM discord_log_xp WHERE message_id = ?",[messageId]);

    }

    public async getTotal(userId:string) {

        return await db.q("SELECT COUNT(xp) as xp from discord_log_xp GROUP BY user_id = ?",[userId]);

    }

    // public async getRanking(limit:number=10,timespan:string="m") {

    //     let timeStart:number = (new Date()).getTime() - (60*60*24*31*1000);
    //     let timeEnd:number = (new Date()).getTime();

    //     if(timespan === "w") {

    //         timeStart = (new Date()).getTime() - (60*60*24*7*1000);

    //     }

    //     if(timespan === "d") {

    //         timeStart = (new Date()).getTime() - (60*60*24*1000);

    //     }

    //     const results = await db.q("SELECT ",[])

    // }


    public async set(message:Discord.Message,userId:string,xp:number=1) {

        const checkHasNotSubmittedBefore = await db.q("SELECT message_id FROM discord_log_xp WHERE message_id = ? AND user_id = ?",[message.id,userId])
            .catch(e=>{console.log(e)});
        
        if(checkHasNotSubmittedBefore.length > 0) return;

        const res = await db.q("INSERT INTO discord_log_xp SET ?",[{
            message_id:message.id,
            guild_id:message.guild.id,
            channel_id:message.channel.id,
            user_id:userId,
            xp:xp
        }]).catch(e=>{console.log(e)});

        return;

    }

}