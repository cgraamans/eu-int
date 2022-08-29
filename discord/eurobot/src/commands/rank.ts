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

		const getRankList:Eurobot.Rank.Row[] = await ModelXP.getRankList(10);
		if(getRankList.length < 1) return;

		let embed = new EmbedBuilder();
		embed.setTitle(`FG Top 10 for this month`);

		let rankList:string = "";
		getRankList.forEach(row=>{

			let rankName = "[deleted]";
			const rankUser = interaction.guild.members.cache.get(row.user_id);
			if(rankUser) rankName = rankUser.user.username;

			rankList += `**${row.rank}** - **@${rankName}** (${row.xp} XP)\n`
		});

		embed.setDescription(`RANKINGS\n${rankList}`)

		await interaction.reply({embeds:[embed],ephemeral:true});

		return;
		
	},

};