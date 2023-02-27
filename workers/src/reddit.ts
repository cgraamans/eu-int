import db from "./lib/services/db";
import {reddit as ModelReddit,top} from "./lib/models";
import {ITypes} from "../types";

import Reddit from "./lib/services/reddit";
import snoowrap from "snoowrap";

let timers:any[] = [];

const interval = 300000;
const randomInterval = 300000;

(async () => {

    const modelReddit = new ModelReddit();
    const modelTop = new top();
    const sources = await db.q(`SELECT * FROM sources WHERE url_reddit IS NOT NULL AND isActive = 1`,[]).catch(e=>{console.log(e)});

    await Promise.all(sources.map(async (source:ITypes.source)=>{

        if(!source.url_reddit) return;

        source.categories = await modelTop.readCategory(source.id);

        const currentInterval = interval + (Math.round(Math.random()*randomInterval));

        timers.push(setInterval(async ()=>{

            console.log(`SOURCE: ${source.name}`);

            const list = await Reddit.client.getSubreddit(source.url_reddit).getHot();
            console.log(list);

            // let feed = await parser.parseURL(source.url_rss).catch(e=>console.log(e,source));
            // if(!feed || !feed.items || feed.items.length < 1) return;

            // const items = await RSS.items(feed.items,source).catch(e=>console.log(e));
            // if(!items) return;
            // console.log(items);

            return;

        },currentInterval));

        console.log(`timer set: ${source.stub} in ${Math.round(currentInterval/1000)}s`);

    }));

})();



/*

{

    id:number
    stub:string
    text:string
    link:string
    raw:string
    created_by:string
    dt_publish:number
    dt_insert:number
    locations:[
        {
            lat:string
            lon:string
            id_country?:number
            id_city?:number
            id_special?:number
            shape?:string
        }
    ]
    links:string[]
    images:string[]
    source:{

        id:number
        name:string
        stub:string
        link:string
        categories:[
            {
                id:number
                name:string
                stub:string
            }
        ]
        image?:string
        language?:number
        feed_rss?:number
        feed_reddit?:number
        feed_youtube?:number
        feed_twitterlist?:number
        isActive:number

    },
    likes:number[],
    user?:{
        id:number
        name:string
        nickname:string
        isSaved:boolean
        isLiked:boolean
    },

}

*/