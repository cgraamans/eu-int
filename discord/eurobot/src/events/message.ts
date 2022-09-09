import discord from "../services/discord";
import {Message,EmbedBuilder, TextChannel, MessageOptions, User, MessageReaction} from "discord.js";
import ArticleModel from "../models/articles";
import DiscordModel from "../models/discord";
import Tools from '../tools';
import {Eurobot} from "../../types/index.d";
import xp from "../models/xp";

const xpEmojis = ["loveEU","eupog"];
const ArticleFilter = (reaction:MessageReaction) => {
	return xpEmojis.includes(reaction.emoji.name);
};

module.exports = {

	name: 'messageCreate',
	async execute(message:Message) {

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
			if(!message.guild) return;
			
			let routing = discord.Config.Routes.filter(route=>route.from === channelId)
			if(routing.length > 0) {

				console.log(`[ROUTING] from: ${message.channel.id}`)

				const embed:EmbedBuilder | string = new EmbedBuilder()

				embed.setAuthor({ name: message.author.username, iconURL: message.author.avatarURL()})
					.setColor(0x003399)
					.setFooter({text:`Via: Forum Götterfunken`, iconURL:`https://discord.gg/M2MnDyU`})
					.setDescription(message.content);

				const messageAttachment = message.attachments.size > 0 ? message.attachments.first().url : null;
				if(messageAttachment) embed.setImage(messageAttachment);

				let routedMessage:MessageOptions = {};
				if(message.content.startsWith("https://")) routedMessage.content = message.content;

				routedMessage.embeds = [embed];

				routing = routing.filter(route=>route.isActive > 0);
				await Tools.asyncForEach(routing, async (route:Eurobot.Route)=>{
					const channel = discord.Client.channels.cache.get(route.to) as TextChannel;
					if(channel) await channel.send(routedMessage);
					return;
				});

			}

		}

		// Channel specific functions
		if(message.channel) {

			// Ignore Channel
			const ignoreChannel = discord.Config.Channels.filter(channel=>channel.category === "Ignore" && channel.channel_id === message.channel.id)
			if(ignoreChannel.length > 0) return;

			// FG SPECIFIC
			// // DELETE ALL NON-ARTICLES FROM #ARTICLES
			// if(message.channel.id === "609511947762925597" && (!message.content.startsWith("https://") && !message.content.startsWith("http://"))) {
				
			// 	await message.delete().catch(e=>console.log(e));
			// 	return;
				
			// }

			// Tweeting
			if (message.content.includes("https://")) {

				let canTweet:Boolean = false;
				const ModelXP = new xp();

				// IS TWEET CHANNEL
				const tweetChannels = discord.Config.Channels.filter(channel=>channel.category === "Twitter" && channel.channel_id === message.channel.id);
				if(tweetChannels.length > 0) {

					const authorized = await discord.authorizeMessage(message,["Admin","Mod","Twitter","FGN"]) ;
					if((authorized && authorized.length > 0) || message.author.id === discord.Client.user.id) {
						
						const ModelArticle = new ArticleModel();

						const post = await ModelArticle.post(message)
							.catch(e=>{console.log(e)});
	
						if(post) {
	
							if(message.author.id !== discord.Client.user.id) {
	
									
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

				// IS NOT TWEET CHANNEL
				} else {

					let reactionChannel = message.guild.channels.cache.get(message.channel.id);
					if(!reactionChannel) return;
					if(!reactionChannel.isTextBased) return;

					const articles = message.guild.channels.cache.find(g=>g.id === "609511947762925597") as TextChannel;
					if(!articles) return;

					const collector = message.createReactionCollector({filter:ArticleFilter, time:1800000});

					collector.on('collect', async (reaction, user) => {

						console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);

						// Get articleMessages
						const articleMessages = await articles.messages.fetch();
						if(!articleMessages) return;

						// Get userGuildMember
						const userGuildMember = reaction.message.guild.members.cache.get(user.id);

						// AUTH LOGIC
						const authorized = await discord.authorizeMember(userGuildMember,["Admin","Mod","Twitter","FGN"]);
						if(authorized.length > 0) {

							// COPY TO ARTICLES

							const ArticleMessage = articleMessages.find(aM=>aM.content.replace(/[^a-zA-Z0-9]/g, "") === message.content.replace(/[^a-zA-Z0-9]/g, ""));
							if(!ArticleMessage) {
								
								await articles.send(`@${message.author.username} (#${reactionChannel.name}) - ${message.content}`);

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

								console.log("MC=>",message.content.replace(/[^a-zA-Z]/g, ""));

								const ArticleMessage = articleMessages.find(aM=>aM.content.replace(/[^a-zA-Z]/g, "") === message.content.replace(/[^a-zA-Z]/g, ""));
								if(!ArticleMessage) {

									console.log("AM=>",ArticleMessage);
									
									await articles.send(`@${message.author.username} (#${reactionChannel.name}) - ${message.content}`);

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



					});
					
					collector.on('end', collected => {
						console.log(`Collected ${collected.size} items`);
					});
						// .then(collected=>{


						// 	console.log(collected);

						// 	if(collected) console.log(collected);

						// }).catch(e=>{
						// 	console.log(e);
						// })

				}

				
				if(message.author.id === discord.Client.user.id) canTweet = true;

				if(tweetChannels.length > 0 && canTweet) {



				}

				// // FIX FOR DISCORD TWITTER
				// if(message.content.includes("https://twitter.com")) {

				// 	const idxInitial = message.content.indexOf("twitter.com");

				// 	message.edit(message.content.slice(0,idxInitial)+"fx"+message.content.slice(idxInitial));
					
				// }

			}

			// Brain
			if(message.mentions.has(discord.Client.user) || message.content.toLowerCase().includes(discord.Client.user.username.toLowerCase())) {

				if(message.author.id === discord.Client.user.id) return;

				const model = new DiscordModel();

				// for random across multiple servers
				// const emoji = Discord.Client.guilds.cache.random().emojis.cache.random();

				// for random from this server
				const emoji = message.guild.emojis.cache.random();

				// TODO
				// if(["are you", "is"])

				if(Math.random() < 0.45) {

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

				if(message.author.id === discord.Client.user.id) return;

				const emoji = message.guild.emojis.cache.random();
				message.react(emoji);

				return;

			}

			// keyword react
			if(message.content.toLowerCase().includes("uschi") || message.content.toLowerCase().includes("metsola") || message.content.toLowerCase().includes("michel")) {

				if(message.author.id === discord.Client.user.id) return;

				const emoji = message.guild.emojis.cache.random();
				message.react(emoji);

				return;

			}

			// FREUDE React
			if(message.content.toLowerCase().match(/freude[!?]*$/gm)) {

				if(message.author.id === discord.Client.user.id) return;

				const emoji = message.guild.emojis.cache.random();
				await message.channel.send(`SCHÖNER ${emoji}`);

				return;

			}

			// GOTTERFUNKEN React
			if(message.content.toLowerCase().endsWith("gotterfunken") || message.content.toLowerCase().endsWith("götterfunken")) {

				if(message.author.id === discord.Client.user.id) return;

				const emoji = message.guild.emojis.cache.random();
				await message.channel.send(`TOCHTER ${emoji}`);

				return;

			}

			// GOTTERFUNKEN React
			if(message.content === "AUS") {

				if(message.author.id === discord.Client.user.id) return;

				const emoji = message.guild.emojis.cache.random();
				const emoji2 = message.guild.emojis.cache.random();

				await message.channel.send(`ELYSIUM ${emoji}`);
				await message.channel.send(`${emoji2}`);

				return;

			}

			// Varoufakis React
			if(message.content.toLowerCase().includes("varoufakis")) {

				if(message.author.id === discord.Client.user.id) return;

				const emoji = message.guild.emojis.cache.find(x=>x.name === "dijsselbloem");
				if(emoji) await message.reply(`${emoji}`);

				return;

			}			

		}

		return;

	},

};