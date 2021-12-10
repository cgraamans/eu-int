import DB from "./lib/services/db";
import Tools from "./lib/tools";
import Config from "./config/workers.json";

let timers:NodeJS.Timer[] = [];

const interval:number = Math.round(Math.random() * Config.localization.timer_offset) + Config.localization.timer

const localize = async (item:{id:number,text:string})=>{



    console.log(item);
    return;

};

// INIT
timers.push(setInterval(async ()=>{

    const items = await DB.q(`
        SELECT ei.id, ei.text 
        FROM euint_items ei 
        LEFT JOIN euint_item_locations eil ON ei.id = eil.item_id 
        LEFT JOIN euint_item_location_log AS eill ON ei.id = eill.item_id
        WHERE eil.item_id IS NULL 
            AND eill.item_id IS NULL
        LIMIT ?
    `,[Config.localization.item_limit]);

    await Tools.asyncForEach(items,async (item:{id:number,text:string})=>localize(item));

    console.log("/interval");

},interval));

console.log(`tick: ${interval}ms (timer: ${Config.localization.timer}ms)`);
