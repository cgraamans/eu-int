import Parser from "rss-parser";
import db from "./lib/services/db";
import {rss, top} from "./lib/models";
import {ITypes} from "../types";

let parser = new Parser();
let timers:any[] = [];

const interval = 300000;
const randomInterval = 300000;

(async () => {

    const RSS = new rss();
    const Top = new top();

    const sources = await db.q(`SELECT * FROM sources WHERE url_rss IS NOT NULL AND isActive = 1`,[]).catch(e=>{console.log(e)});

    await Promise.all(sources.map(async (source:ITypes.source)=>{

        if(!source.url_rss) return;

        const currentInterval = interval + (Math.round(Math.random()*randomInterval));

        source.categories = await Top.readCategory(source.id)

        timers.push(setInterval(async ()=>{

            console.log(`SOURCE: ${source.name}`);

            let feed = await parser.parseURL(source.url_rss).catch(e=>console.log(e,source));
            if(!feed || !feed.items || feed.items.length < 1) return;

            const items = await RSS.createItems(feed.items,source).catch(e=>console.log(e));
            if(!items) return;
            console.log(items);

            return;

        },currentInterval));

        console.log(`timer set: ${source.stub} in ${Math.round(currentInterval/1000)}s`);

    }));

})();



