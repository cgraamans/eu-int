import {MessageReaction, Message, ReactionEmoji,User} from "discord.js";
import discord from "../services/discord";
// import TwitterModel from "../models/twitter";
import db from "../services/db";

module.exports = {
	name: 'messageReactionAdd',
	async execute(reaction:MessageReaction, user:User) {
        
        if (reaction.partial) {

            try {
                await reaction.fetch();
            } catch (error) {
                console.error('Something went wrong when fetching the message:', error);
                // Return as `reaction.message.author` may be undefined/null
                return;
            }
        }
        if(!reaction.message) return;
        if(!reaction.message.content.includes("https://")) return;
        if(reaction.message.channel.id === "609511947762925597") return;
        if(reaction.message.guildId !== "257838262943481857") return;
        
        if(['loveEU'].includes(reaction.emoji.name)) {

            console.log('LOVEEU REACTION!');
            
            const articles = reaction.message.guild.channels.cache.find(g=>g.id === "609511947762925597");
            if(!articles || !articles.isTextBased()) return;

            const member = reaction.message.guild.members.cache.get(user.id);
            if(!member) return;
            const hasRole = member.roles.cache.some(role => role.name === 'Admin' || role.name === 'Articles Contributor' || role.name === 'Twitter' || role.name === 'Moderator')

            console.log(`is authorized: ${hasRole}`);

            const uri = reaction.message.content.match(/\bhttps?:\/\/\S+/gi);
            const url = uri[0];
            const hasDoubles = await db.q(`
                SELECT * FROM log_articles WHERE text REGEXP '${url}'
            `).catch(e=>console.log(e));

            if(hasDoubles.length > 0) {
                console.log(`double!`,hasDoubles);
                return;
            }
            await articles.send(reaction.message.content);
            console.log('not double!');

        }

    }

}
// 		const ModelTwitter = new TwitterModel();

// 		if(reaction.emoji.name === "loveEU") {

// 			if(reaction.message.guildId !== "257838262943481857") return;

// 			const authorized = await discord.authorizeReaction(reaction,["Admin","Mod","Twitter","FGN"]);
// 			if(authorized && authorized.length < 1) return;

// 			console.log(authorized);

// 			const message = await reaction.message.fetch();

// 			if(!message.content.startsWith("https://") && !message.content.startsWith("http://")) return;
// 			if(!message) return;

// 			const post = await ModelTwitter.post(message)
// 			.catch(e=>{console.log(e)});

// 			if(post) {
// 				console.log("💙 Tweeted "+message.content);
// 			}

// 			if(message.channel.id === "609511947762925597") return;
// 			const articles = message.guild.channels.cache.find(g=>g.id === "609511947762925597");

// 			if(articles && articles.isText()) {
				
// 				const articleMessages = await articles.messages.fetch();
// 				const ArticleMessage = articleMessages.find(aM=>aM.content === message.content);
// 				if(!ArticleMessage) await articles.send(message.content);

// 			}

// 		}

// 		// console.log(reaction);
// 		return;

// 	},

// };