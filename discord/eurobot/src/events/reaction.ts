import {MessageReaction, TextChannel, User} from "discord.js";
import discord from "../services/discord";
import xp from "../models/xp";

module.exports = {
	name: 'messageReactionAdd',
	async execute(reaction:MessageReaction, user:User) {

		const xpEmojis = ["loveEU","❤️","👍","marks","okrutte","EUpepesalute","UA_Pepe","eupog"];

		const ModelXP = new xp();
		const message = await reaction.message.fetch();

		if(xpEmojis.includes(reaction.emoji.name)) {

			if(!message.channel) return;
			let channel = message.guild.channels.cache.get(message.channel.id);

			if(!channel.isTextBased) return;

			if(message.guild.id !== "257838262943481857") return;
			if(channel.id === "609511947762925597") return;
			
			const articles = message.guild.channels.cache.find(g=>g.id === "609511947762925597") as TextChannel;
			if(!articles) return;

			// CONTENT CHECK
			if(!message.content.includes("https://") && !message.content.includes("http://")) return;

			// AUTH LOGIC
			const authorized = await discord.authorizeReaction(reaction,["Admin","Mod","Twitter","FGN"]);
			if(authorized.length > 0) {

				// COPY TO ARTICLES
				const articleMessages = await articles.messages.fetch({limit:100});
				const ArticleMessage = articleMessages.find(aM=>aM.content === message.content);
				if(!ArticleMessage) await articles.send(`\@${message.author.username} (\#${channel.name})\n${message.content}`);

				// SET XP
				await ModelXP.set(message,reaction.message.author.id,3)
				.catch(e=>{
					console.log(`Error adding 3 XP to ${reaction.message.author.username}`)
					console.log(e);
				});

				return;
				
			}

			// PLEB LOGIC

			// SET XP
			await ModelXP.set(message,reaction.client.user.id)
				.catch(e=>{
					console.log(`Error adding 1 XP to ${reaction.client.user.username}`)
					console.log(e);
				});

			console.log(`Adding 1 XP to ${reaction.client.user.username}`)

			const numXP = await ModelXP.getByMessage(message.id)
				.catch(e=>{console.log(e)});

			if(numXP.length > 2) {

				const articleMessages = await articles.messages.fetch({limit:100});
				const ArticleMessage = articleMessages.find(aM=>aM.content === message.content);
				if(!ArticleMessage) await articles.send(`\@${message.author.username} (\#${channel.name})\n${message.content}`);

			}

			return;

		}

		return;

	},

};