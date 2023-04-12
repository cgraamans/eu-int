import * as fs from "fs";
import { Collection, EmbedBuilder, TextChannel} from "discord.js";
import {Eurobot} from "./types/index";

import Discord from "./src/services/discord";
import db from "./src/services/db";

import {CalendarModel} from "./src/models/google";
import NewsModel from "./src/models/news";
import DiscordModel from "./src/models/discord";

import google from "./src/services/google";
import Tools from './src/tools';

import * as schedule from "node-schedule";

let jobs:schedule.Job[] = [];

const calendarModel = new CalendarModel();
const newsModel = new NewsModel();
const discordModel = new DiscordModel();

console.log(`APP Init [${new Date()}] @ ${__dirname}`);


// SET COMMANDS
try {

    Discord.Client.commands = new Collection();

    const commands = [];

    const commandFiles = fs.readdirSync(__dirname+'/src/commands').filter(file=>!file.endsWith(".map"));

    for (const file of commandFiles) {
        const command = require(`${__dirname}/src/commands/${file}`);
        Discord.Client.commands.set(command.data.name, command);
    }

} catch(e) {

    console.log(e);

}

// INTERACTIONS
Discord.Client.on("interactionCreate", async (interaction)=>{

    if (!interaction.isCommand()) return;

    console.log(`${interaction.commandName} by ${interaction.user.username}`);

    const command = Discord.Client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`>> ${interaction.commandName} by ${interaction.user.username}`,error,`\n`);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }

});

//
// JOBS
//

try {

    // // EVENT CHECK JOB
    // jobs.push(schedule.scheduleJob(`*/3 * * * *`, async function(){

    //     const calendar = await google.Calendar({from:new Date(new Date().getTime() - (3*60*1000)),to:new Date()});

    //     if(calendar.length > 0) {

    //         const embed = new EmbedBuilder()
    //             .setTitle(`🇪🇺 Event Starting!`)
    //             .setColor(0x001489);

    //         Tools.asyncForEach(calendar,async (entry:any)=>{

    //             if(!entry.start) return;
    //             if(!entry.start.dateTime) return;
    //             if(entry.status !== "confirmed") return;

    //             const loggedID = await calendarModel.getLogID(entry.id);

    //             if(loggedID) return; 

    //             let description = "";
    //             if(entry.description) description = `${entry.description}\n`;

    //             embed.setDescription(`**${entry.summary}**\n${description}\nStarts: ${Tools.dateToHHss(new Date(entry.start.dateTime),false)} (NOW!), Ends: ${Tools.dateToHHss(new Date(entry.end.dateTime),false)}`)

    //             await discordModel.pushJobToDiscord("Job-Calendar-EventCheck",embed);

    //             await calendarModel.postLogID(entry.id);

    //             return;

    //         });

    //     }

    //     return;

    // })); // EVENT CHECK JOB

    // CALENDAR JOB MORNING
    jobs.push(schedule.scheduleJob(`0 7 * * *`, async function(){
    
		const span:Eurobot.Calendar.Span = calendarModel.textToUnixTimeRange("today");
		const items = await google.Calendar(span.range).catch(e=>{console.log(e)});
        if(!items || items.length < 1) return;

		const calendar = calendarModel.toStringCalendar(items,span)

		const calendarDescription:string = `Calendar for ${span.human}\n\n`;

		const embed = new EmbedBuilder()
			.setTitle(`🇪🇺 Eurobot Calendar`)
			.setDescription(calendarDescription + calendar)
			.setColor(0x001489)
            .setFooter({text:`use /calendar :)`});
    
        await discordModel.pushEmbedToDiscord("Job-Calendar",embed);

        return;

    }));


    // CALENDAR JOB EVENING
    jobs.push(schedule.scheduleJob(`0 19 * * *`, async function(){
    
		const span:Eurobot.Calendar.Span = calendarModel.textToUnixTimeRange("tomorrow");
		const items = await google.Calendar(span.range).catch(e=>{console.log(e)});
        if(!items || items.length < 1) return;

		const calendar = calendarModel.toStringCalendar(items,span)

		const calendarDescription:string = `Calendar for ${span.human}\n\n`;

		const embed = new EmbedBuilder()
			.setTitle(`🇪🇺 Eurobot Calendar`)
			.setDescription(calendarDescription + calendar)
			.setColor(0x001489);  
    
        await discordModel.pushEmbedToDiscord("Job-Calendar",embed);

        return;

    }));

    // Idlestop
    jobs.push(schedule.scheduleJob(`*/5 * * * *`, async function(){


        const confChannels = Discord.Config.Channels.filter(ch=>ch.category === "Idlestop");
        if(confChannels.length < 1) return;
        console.log('pip');

        Discord.Client.guilds.cache.forEach(guild => {

            Tools.asyncForEach(confChannels,async (target:Eurobot.Channel) => {

                const channel = guild.channels.cache.get(target.channel_id);
                if(channel && channel.isTextBased()) {

                    console.log(`channel name: ${channel.name}, timestamp: ${(channel as TextChannel).lastMessage.createdTimestamp}`);

                    // if(channel.lastMessage.createdTimestamp)

                    

                    // logic for checking if channel has been idle

                }
                return;

            });

            return;

        });

        return;

    }));

    // News JOB
    jobs.push(schedule.scheduleJob(`0 */4 * * *`, async function(){

        let newsObj:Eurobot.News.Obj = {keyword:"eunews"};

        const subreddits = ['eunews','europeanarmy','europeanfederalists','europeanculture','europeanunion','euspace','eutech'];
        newsObj.keyword = subreddits[Math.floor(Math.random()*subreddits.length)];

		const keywordObjRow = await newsModel.getKeywordObjRow(newsObj.keyword);
        if(!keywordObjRow) return;
        
        newsObj.row = keywordObjRow;

		// get news
		newsObj = await newsModel.get(newsObj);
        if(!newsObj) return;

		if((newsObj.subreddit && newsObj.subreddit.length > 0) || (newsObj.twitter && newsObj.twitter.length > 0)) {    

            const embed = newsModel.toRich(newsObj);
            if(!embed) return;
            
            embed.setFooter({text:`/r/${newsObj.row.name} - use /news for more news :)`});

            await discordModel.pushEmbedToDiscord("Job-News",embed);
    
        }

        return;

    }));

    // News to articles job
    jobs.push(schedule.scheduleJob(`*/4 * * * *`, async function(){

        let newsObj:Eurobot.News.Obj = {keyword:"eunews"};
        const subreddits = ['EUNews','EuropeanArmy','EuropeanUnion','EUSpace','EUTech'];
        newsObj.keyword = subreddits[Math.floor(Math.random()*subreddits.length)];
		
        // get news
		newsObj = await newsModel.get(newsObj);
        if(!newsObj) return;
        if((newsObj.subreddit &&newsObj.subreddit.length > 0) || (newsObj.twitter && newsObj.twitter.length > 0)) {    

            await Promise.all(newsObj.subreddit.map(async (item)=>{

                if(!item.title || !item.url) return;
                if(item.thumbnail === "self" || item.thumbnail === "nsfw" || item.thumbnail === "default") return;
                if(item.is_self || item.is_video || item.is_meta) return;
                if(item.num_crossposts > 0) return;
                if(item.url.endsWith(".jpg")) return;
                if(item.url.endsWith(".png")) return;
                if(item.url.startsWith("https://v.redd.it")) return;

                let url = item.url;
                if(url.includes("?")) {
                    const uri = item.url.split("?");
                    url = uri[0];
                }

                const hasDoubles = await db.q(`
                    SELECT * FROM log_articles WHERE text REGEXP '${url}'
                `).catch(e=>console.log(e));
    
                if(hasDoubles.length > 0) return;

                console.log(`< REDDIT ${item.url}`);

                // post to articles
                await discordModel.pushTextToDiscord("Reddit-to-Articles",`Source: /r/${newsObj.keyword}\n${url}`);

            }));

        }

    }));


} catch(e) {

    console.error(e);

}