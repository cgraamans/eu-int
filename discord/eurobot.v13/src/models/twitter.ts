import Discord from "discord.js";
import * as FileType from "file-type"
import * as https from "https";

import Twitter from "../services/twitter";
import Tools from '../tools';

import {Eurobot} from "../../types/index";

import db from "../services/db";


export default class TwitterModel {

    constructor() {

    }

    private async getFile(url:string):Promise<Buffer> {

        return new Promise((resolve,reject)=>{

            let data:any[] = []

            https.get(url, (res) => {

                if (res.statusCode === 200) {

                    res.on("data",chunk=>{
                        data.push(chunk);
                    });

                    res.on("end",()=>{
                        const buffer:Buffer = Buffer.concat(data);
                        resolve(buffer);
                    });

                    res.on("error",err=>{
                        reject(err);
                    });

                } else {

                    reject(`Server responded with ${res.statusCode}: ${res.statusMessage}`);

                }

            });

        });

    }

    public async post(message:Discord.Message,user?:Discord.User|Discord.PartialUser) {

        let text = message.content;

        // only tweets that dont exist
        const hasTweet = await db.q("SELECT * FROM discord_tweets WHERE text = ?",[text]);
        if(hasTweet.length > 0) return;

        let media:Eurobot.Twitter.MediaObj[] = [];
        let discordUserID = message.author.id;
        if(user) discordUserID = user.id;

        // Determine Length of tweet
        const textArr = text.split(" ");
        let textLinks = 0;
        let textElements:string[] = [];
        textArr.forEach(textElement=>{
            if(textElement.startsWith("https://")) {
                textLinks++;
            } else {
                textElements.push(textElement);
            }
        });
        if(textElements.join(" ").length + textLinks * 23 > 280) return;

        // images [WIP]
        if(message.attachments) {

            let urls:string[] = [];

            message.attachments.forEach(attachment=>{
                urls.push(attachment.url);
            });

            await Tools.asyncForEach(urls,async (url:string)=>{

                const file = await this.getFile(url)
                                .catch(e=>{console.log(e)});

                if(file) {

                    const type = FileType.fromBuffer(file).toString();
                    media.push({size:Buffer.byteLength(file).toString(),type:type,data:file});

                }

                return;

            });

            if(message.content.length < 1 && media.length < 1) return;

        }

        const post = await Twitter.post(message.content,media);

        await db.q("INSERT INTO discord_tweets SET ?",[{
            user_id:discordUserID,
            text:text
        }]);

        return post;

    }

}