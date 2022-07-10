import {Message, MessageEmbed} from "discord.js";
import discord from "../services/discord";
import {Eurobot} from "../../types/index";

import Tools from '../tools';

export default class DiscordModel {

    constructor() {}

    // comment with emoji and category as options
    public async comment(message:Message,options?:Eurobot.Message.Comment) {
        
        options = Object.assign({category:"default"},options);
        
        const Reactions = discord.Config.Reactions.filter(r=> r.category === options.category);
        if(Reactions.length < 1) return;
        const Reaction = Reactions[Math.floor(Math.random() * (Reactions.length - 1))];

        let comment:string;
        // comment order
        if(Math.random() < 0.5) {
            comment =  `${Reaction.reaction} ${options.emoji ? options.emoji : ""}`;
        } else {
            comment = `${options.emoji ? options.emoji : ""} ${Reaction.reaction}`;
        }

        return comment;

    }

    // push job outputs to discord
    public async pushJobToDiscord(name:string,embed:MessageEmbed){
        
        const confChannels = discord.Config.Channels.filter(ch=>ch.category === name);
        if(confChannels.length < 1) return;
        
        discord.Client.guilds.cache.forEach(guild => {

            Tools.asyncForEach(confChannels,async (target:Eurobot.Channel) => {

                const channel = guild.channels.cache.get(target.channel_id);
                if(channel && channel.isText()) {
                    await channel.send({embeds:[embed]});
                }
                return;

            });

            return;

        });

        return;

    }

}