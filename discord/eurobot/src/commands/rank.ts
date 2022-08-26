import xp from "../models/xp"
import { SlashCommandBuilder } from "@discordjs/builders";
import {Eurobot} from "../../types"
import { CommandInteraction, EmbedBuilder } from "discord.js";

const data = new SlashCommandBuilder()
	.setName('rank')
	.setDescription('Retrieves your rank from Forum Gotterfunken');

module.exports = {

	data: data,

	async execute(interaction:CommandInteraction) {

		if (!interaction.isChatInputCommand()) return;
		if(!interaction.guild) return;

		const ModelXP = new xp();

		// const rank = await ModelXP.getRanking(interaction.user.id)
		const getRank = await ModelXP.getRankList(10);

		let embed = new EmbedBuilder();
		embed.setTitle(`FG Top 10 for this month`);
		embed.setDescription(`TOTAL XP: **0**`)

		await interaction.reply({embeds:[embed],ephemeral:true});

		return;
		
	},

};