// import {MessageReaction, Message, ReactionEmoji} from "discord.js";
// import discord from "../services/discord";
// import TwitterModel from "../models/twitter";

// module.exports = {
// 	name: 'messageReactionAdd',
// 	async execute(reaction:MessageReaction) {

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