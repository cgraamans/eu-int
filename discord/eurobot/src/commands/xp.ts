import xp from "../models/xp"
import { SlashCommandBuilder } from "@discordjs/builders";
import {Eurobot} from "../../types"
import { CommandInteraction, EmbedBuilder } from "discord.js";

const data = new SlashCommandBuilder()
	.setName('xp')
	.setDescription('Retrieves your xp from Forum Gotterfunken');

module.exports = {

	data: data,

	async execute(interaction:CommandInteraction) {

		if (!interaction.isChatInputCommand()) return;
		if(!interaction.guild) return;

		const ModelXP = new xp();

		// const rank = await ModelXP.getRanking(interaction.user.id)
		const total = await ModelXP.getTotal(interaction.user.id);

		if(total && total.length > 1) {
			
			let embed = new EmbedBuilder();
			embed.setTitle(`${interaction.user.username}`);
			embed.setDescription(`TOTAL XP: **${total[0].xp}**`)

			await interaction.reply({embeds:[embed],ephemeral:true});

		}
		return;
		
	},

};