import db from "../services/db";
import Discord from "discord.js";
import reddit from "../services/reddit";
import {Eurobot} from "../../types/index.d"

export default class NewsModel {

    public maxListSize:number;

    constructor(maxListSize:number = 3) {

        this.maxListSize = maxListSize;

    }

    public async getKeywordObjRow(keyword:string) {

        const keyDefList:Eurobot.News.Row[] = await db.q(`
                SELECT * FROM discord_news WHERE \`key\` = ?
            `,
            [keyword.toLowerCase()])
            .catch(e=>{console.log(e)});

        if(keyDefList.length > 0) return keyDefList[0];
        
        return;

    }

    // TODO: Function for raw output to replace keydeflist in get
    public async get(obj:Eurobot.News.Obj) {

        let hot = await reddit.client.getHot(obj.keyword,{limit:this.maxListSize+2})
            .catch(e=>{console.log(e)});

        if(hot){

            obj.subreddit = hot;
        
        }

        return obj;

    }

    // Convert news to rich output
    // toRich
    public toRich(news:Eurobot.News.Obj) {

        if(!news.row) return;

        let name = news.keyword

        if(news.row.subreddit) name = news.row.subreddit;
        if(news.row.name) name = news.row.name;

        let text = ``;
        let footer = `Source: ${name}`;

        // subreddits
        if(news.subreddit && news.subreddit.length > 0) {

            let embed = new Discord.MessageEmbed()
                .setTitle(`🇪🇺 Eurobot News`)
                .setColor(0xFFCC00);
            if(news.row.url) {
                footer = `Source: ${name} | URL: ${news.row.url}`;
            }
            embed.setFooter(footer);

            // filter sticked
            news.subreddit = news.subreddit.filter(submission=>{
                return !submission.stickied;
            });

            // reduce to max list size
            news.subreddit.length = this.maxListSize;

            let thumbnail:string;
            news.subreddit.forEach((submission)=>{

                if(!thumbnail && submission.thumbnail && submission.thumbnail !== "self") thumbnail = submission.thumbnail; 
                text += `🔹${submission.title}\n<${submission.url}>\n\n`;

            });
            if(thumbnail) embed.setThumbnail(thumbnail);
            embed.setDescription(text);

            return embed;

        }

        return;

    } // toRich

}