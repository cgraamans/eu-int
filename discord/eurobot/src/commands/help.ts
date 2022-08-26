import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, EmbedBuilder } from "discord.js";
import discord from "../services/discord";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Get help!'),
	async execute(interaction:CommandInteraction) {

		if(!interaction.guild) return;

		const emoji = interaction.guild.emojis.cache.random();

		let embed = new EmbedBuilder()
			.setTitle(`🇪🇺 Eurobot Help`)
			.setColor(0x001489)
			.setFooter({text:`Find me on https://twitter.com/eunewsbot`, iconURL:"https://twitter.com/eunewsbot"})
			.setDescription(`Commands:
\`\`\`
	
	/help - this help
	/ping - test the bot

	/topics - get current topics
	/news - get hot subreddit news
	/latest - latest subreddit news

	/calendar - list calendar entries
	/events - list events

	/country - list countries
	/country <country name> - add/remove country.

	/xp - Get your xp total
	/rank - top 10 xp rankings

\`\`\`

Functionality:

	- News 4x a day
	- Calendar events 3x a day
	- If 3 users react with :loveEU: to an article on FG it will get published and tweeted via https://twitter.com/eunewsbot
			`);

		await interaction.reply({embeds:[embed],ephemeral:true});
		
	},
};