import { SlashCommandBuilder, } from "@discordjs/builders";
import discord from "../services/discord";
import google from "../services/google";
import {CalendarModel} from  "../models/google";
import {Eurobot} from "../../types/index";
import { MessageEmbed } from "discord.js";

const data = new SlashCommandBuilder()
	.setName('calendar')
	.setDescription('Get the Götterfunken calendar');

data.addStringOption(option => 
	option
		.setName('timespan')
		.setDescription('Number of days')
		.addChoice('today', 'today')
		.addChoice('tomorrow', 'tomorrow')
		.addChoice('7 days', '7d')
		.addChoice('14 days', '14d')
);

module.exports = {

	data: data,

	async execute(interaction:any) {

		const model = new CalendarModel();

		let timespan = "7d"
		const stringOption = interaction.options.getString('timespan');
		if(stringOption) timespan = stringOption;

		const span:Eurobot.Calendar.Span = model.textToUnixTimeRange(timespan);
		const items = await google.Calendar(span.range)

		const calendar = model.toStringCalendar(items,span)

		let calendarDescription:string = `Calendar for ${span.human}\n\n`;

		const embed = new MessageEmbed()
			.setTitle(`🇪🇺 Eurobot Calendar`)
			.setDescription(calendarDescription + calendar)
			.setColor(0x001489);

		interaction.reply({embeds:[embed],ephemeral:true});

		return;

	},
};