import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import discord from "../services/discord";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Get help!'),
	async execute(interaction:CommandInteraction) {

		if(!interaction.guild) return;

		const emoji = interaction.guild.emojis.cache.random();

		let embed = new MessageEmbed()
			.setTitle(`🇪🇺 Eurobot Help`)
			.setColor(0x001489)
			.setFooter(`Find me on https://twitter.com/eunewsbot `)
			.setDescription(`${emoji}
\`\`\`
	
	/help - this help
	/ping - test the bot

	/topics - get current topics
	/news - get news

	/calendar - list calendar entries
	/events - list events

	/country - list countries
	/country <country name> add/remove country.

\`\`\`
			`);

		await interaction.reply({embeds:[embed],ephemeral:true});
		
	},
};