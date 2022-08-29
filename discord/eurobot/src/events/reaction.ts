import {MessageReaction, TextChannel, User} from "discord.js";
import discord from "../services/discord";
import xp from "../models/xp";

module.exports = {
	name: 'messageReactionAdd',
	async execute(reaction:MessageReaction, user:User) {

		const xpEmojis = ["loveEU","eupog"];

		const ModelXP = new xp();
		const message = await reaction.message.fetch();

		if(xpEmojis.includes(reaction.emoji.name)) {

			if(!message.channel) return;
			let channel = message.guild.channels.cache.get(message.channel.id);
			if(!channel) return;
			if(!channel.isTextBased) return;

			if(message.guild.id !== "257838262943481857") return;
			if(channel.id === "609511947762925597") return;
			
			// Fetch article messages
			const articles = message.guild.channels.cache.find(g=>g.id === "609511947762925597") as TextChannel;
			if(!articles) return;

			const articleMessages = await articles.messages.fetch({limit:25, cache: false});
			if(!articleMessages) return;

			// Content check
			if(!message.content.includes("https://") && !message.content.includes("http://")) return;

			// Get GuildMember
			const userGuildMember = reaction.message.guild.members.cache.get(user.id);

			// AUTH LOGIC
			const authorized = await discord.authorizeMember(userGuildMember,["Admin","Mod","Twitter","FGN"]);
			if(authorized.length > 0) {

				// COPY TO ARTICLES
				const ArticleMessage = articleMessages.find(aM=>aM.content.replace(/[^a-zA-Z]/g, "") === message.content.replace(/[^a-zA-Z]/g, ""));
				if(!ArticleMessage) {
					
					await articles.send(`\@${message.author.username} (\#${channel.name})\n${message.content}`);

					// SET XP
					await ModelXP.set(message,message.author.id,3)
					.catch(e=>{
						console.log(`[XP] Error adding 3 XP to ${message.author.username}`)
						console.log(e);
					});
					console.log(`[XP] Adding 3 XP to ${message.author.username}`);

				}
				return;
				
			} else {

				// SET XP
				await ModelXP.set(message,userGuildMember.id)
					.catch(e=>{
						console.log(`[XP] Error adding 1 XP to ${user.username}`)
						console.log(e);
					});

				console.log(`[XP] Adding 1 XP to ${user.username}`);

				const numXP = await ModelXP.getByMessage(message.id)
					.catch(e=>{console.log(e)});

				if(numXP.length > 2) {

					// COPY TO ARTICLES
					const ArticleMessage = articleMessages.find(aM=>aM.content.replace(/[^a-zA-Z]/g, "") === message.content.replace(/[^a-zA-Z]/g, ""));
					if(!ArticleMessage) {
						
						await articles.send(`\@${message.author.username} (\#${channel.name})\n${message.content}`);

						// SET XP
						await ModelXP.set(message,message.author.id,3)
						.catch(e=>{
							console.log(`[XP] Error adding 3 XP to ${message.author.username}`)
							console.log(e);
						});
						
						console.log(`[XP] Adding 3 XP to ${message.author.username}`);

					}

				}

				return;

			}

		}

		return;

	},

};