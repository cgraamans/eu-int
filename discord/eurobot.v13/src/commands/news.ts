import NewsModel from "../models/news";
import { SlashCommandBuilder } from "@discordjs/builders";
import {Eurobot} from "../../types/index.d"
import { CommandInteraction } from "discord.js";

const data = new SlashCommandBuilder()
	.setName('news')
	.setDescription('Retrieves news from the Forum Gotterfunken network');

data.addStringOption(option => 
	option
		.setName('source')
		.setDescription('News Source')
		.addChoice('/r/EUNews', 'EUNews')
		.addChoice('/r/EuropeanArmy', 'EuropeanArmy')
		.addChoice('/r/EuropeanFederalists', 'EuropeanFederalists')
		.addChoice('/r/EuropeanCulture', 'EuropeanCulture')
		.addChoice('/r/EuropeanUnion', 'EuropeanUnion')
		.addChoice('/r/EUSpace', 'EUSpace')
		.addChoice('/r/EUTech', 'EUSpace')
		.addChoice('/r/Yurop', 'Yurop')
);

module.exports = {

	data: data,

	async execute(interaction:CommandInteraction) {

		if(!interaction.guild) return;

		const news = new NewsModel();

		let newsObj:Eurobot.News.Obj = {keyword:"eunews"};

		// keyword
		let stringOption = interaction.options.getString('source');
		if(stringOption) newsObj.keyword = stringOption

		// row from db
		const keywordObjRow = await news.getKeywordObjRow(newsObj.keyword);
		if(!keywordObjRow) {
			await interaction.reply({content:`No news for ${newsObj.keyword}, sorry.`,ephemeral:true});
			return;
		}
		newsObj.row = keywordObjRow;

		// get news
		newsObj = await news.get(newsObj);
		if(newsObj.subreddit.length < 1 && newsObj.twitter.length < 1) {
			await interaction.reply({content:`No news for ${newsObj.keyword}, sorry.`,ephemeral:true});
			return;
		}

		const embed = news.toRich(newsObj);

		await interaction.reply({embeds:[embed],ephemeral:true});

		return;
		
	},

};