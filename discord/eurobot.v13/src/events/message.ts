import discord from "../services/discord";
import {Message,MessageEmbed, TextChannel, MessageOptions} from "discord.js";
import TwitterModel from "../models/twitter";
import DiscordModel from "../models/discord";
import Tools from '../tools';
import {Eurobot} from "../../types/index.d"
import * as os from 'os';

module.exports = {

	name: 'messageCreate',
	async execute(message:Message) {

		if(message.webhookId) console.log(message);

		// Routing
		if(discord.Config.Routes) {

			let channelId:string;
			if(message.webhookId) {
				
				channelId = message.channelId;
				console.log("WEBHOOK",message,"/WEBHOOK");
				console.log("CID",channelId,"/CID");
			}
			if(message.channel && message.channel.id) channelId = message.channel.id;

			if(!channelId) return;
			
			let routing = discord.Config.Routes.filter(route=>route.from === channelId)
			if(routing.length > 0) {

				console.log(`[ROUTING] from: ${message.channel.id}`)

				const embed:MessageEmbed | string = new MessageEmbed()

				embed.setAuthor(message.author.username, message.author.avatarURL())
					.setColor(0x003399)
					.setFooter(`Via: Forum Götterfunken | https://discord.gg/M2MnDyU`)
					.setDescription(message.content);

				const messageAttachment = message.attachments.size > 0 ? message.attachments.first().url : null;
				if(messageAttachment) embed.setImage(messageAttachment);

				let routedMessage:MessageOptions = {};
				if(message.content.startsWith("https://")) routedMessage.content = message.content;

				routedMessage.embeds = [embed];

				routing = routing.filter(route=>route.isActive > 0);
				await Tools.asyncForEach(routing, async (route:Eurobot.Route)=>{
					const channel = discord.Client.channels.cache.get(route.to);
					if(channel && channel.isText()) await channel.send(routedMessage);
					return;
				});

			}

		}

		if(message.author.id === discord.Client.user.id) return;

		// Channel specific functions
		if(message.channel) {

			// Ignore Channel
			const ignoreChannel = discord.Config.Channels.filter(channel=>channel.category === "Ignore" && channel.channel_id === message.channel.id)
			if(ignoreChannel.length > 0) return;

			// FG SPECIFIC
			// DELETE ALL NON-ARTICLES FROM #ARTICLES
			if(message.channel.id === "609511947762925597" && (!message.content.startsWith("https://") && !message.content.startsWith("http://"))) {
				
				await message.delete().catch(e=>console.log(e));
				return;
				
			}

			// Tweeting
			if (message.content.startsWith("https://")) {

				const authorized = await discord.authorizeMessage(message,["Admin","Mod","Twitter","FGN"]);
				if(authorized && authorized.length < 1) return;

				const tweetChannels = discord.Config.Channels.filter(channel=>channel.category === "Twitter" && channel.channel_id === message.channel.id);
				if(tweetChannels.length > 0) {

					const ModelTwitter = new TwitterModel();

					const post = await ModelTwitter.post(message)
						.catch(e=>{console.log(e)});

					if(post) {

						console.log("💙 Tweeted "+message.content);
		
					}

				}

			}

			// Brain
			if(message.mentions.has(discord.Client.user) || message.content.toLowerCase().includes(discord.Client.user.username.toLowerCase())) {
				
				const model = new DiscordModel();

				// for random across multiple servers
				// const emoji = Discord.Client.guilds.cache.random().emojis.cache.random();

				// for random from this server
				const emoji = message.guild.emojis.cache.random();

				// TODO
				// if(["are you", "is"])

				if(Math.random() < 0.66) {

					// respond
					const comment = await model.comment(message,{emoji:emoji})

					// reply type
					if(!message.channel) {
						await message.reply(comment);
						return;
					}

					if(Math.random() < 0.66) {
						await message.reply(comment);
					} else {
						await message.channel.send(comment);
					}

				} else {

					// react with emoji
					await message.react(emoji);

				}

				return;
				
			}

			// EU flag React [loveEU]
			if(message.content.toLowerCase().includes("🇪🇺")) {

				const emoji = message.guild.emojis.cache.random();
				message.react(emoji);

				return;

			}

			// keyword react
			if(message.content.toLowerCase().includes("uschi") || message.content.toLowerCase().includes("sassoli") || message.content.toLowerCase().includes("michel")) {

				const emoji = message.guild.emojis.cache.random();
				message.react(emoji);

				return;

			}

			// FREUDE React
			if(message.content.toLowerCase().match(/freude[!?]*$/gm)) {

				const emoji = message.guild.emojis.cache.random();
				await message.channel.send(`SCHÖNER ${emoji}`);

				return;

			}

			// GOTTERFUNKEN React
			if(message.content.toLowerCase().endsWith("gotterfunken") || message.content.toLowerCase().endsWith("götterfunken")) {

				const emoji = message.guild.emojis.cache.random();
				await message.channel.send(`TOCHTER ${emoji}`);

				return;

			}

			// GOTTERFUNKEN React
			if(message.content === "AUS") {

				const emoji = message.guild.emojis.cache.random();
				const emoji2 = message.guild.emojis.cache.random();

				await message.channel.send(`ELYSIUM ${emoji}`);
				await message.channel.send(`${emoji2}`);

				return;

			}

			// Varoufakis React
			if(message.content.toLowerCase().includes("varoufakis")) {

				const emoji = message.guild.emojis.cache.find(x=>x.name === "dijsselbloem");
				if(emoji) await message.reply(`${emoji}`);

				return;

			}			

		}

		return;

	},

};