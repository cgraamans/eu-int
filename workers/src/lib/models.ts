import { ITypes } from "../../types";
import db from "./services/db";
import shortid from "shortid";

export class top {

    // get categories for sources
    async readCategory(source_id:number) {

        return await db.q(`
            SELECT c.* 
            FROM sources_categories as sc
            INNER JOIN categories c ON sc.category_id = c.id
            WHERE sc.source_id = ?
        `,[source_id]).catch(e=>console.log(e));

    }

    // createCategory()

    async readItemObject(item:ITypes.item,options:{isImage:boolean,isVideo:boolean,isLink:boolean}){
        
        // return await db.q(`
        // SELECT * from item_objects 
        // WHERE
        // `)
    }

    // createItemObject

    // reverse lookup
    //
    // readItemTextLocation
    // createItemTextLocation
    // readItemLocation
    // readItem

}

export class reddit {

    async createItems(items:any[],source:ITypes.source) {};

}

export class twitter {

    async createItems(items:any[],source:ITypes.source) {};

}

export class rss {

    async createItems(items:any[],source:ITypes.source) {

        let duplicates:number = 0;
        let itemReturn:ITypes.item[] = [];

        await Promise.all(items.map(async (item)=>{

            if(!item.title || typeof(item.title) !== "string") return;

            console.log(item);

            const exists = await db.q(`SELECT text FROM items WHERE link = ?`,[item.link]).catch((e)=>console.log(e));
            if(exists.length > 0) {
                duplicates++;
                return;
            }

            let pubDate = (new Date(item.pubDate).getTime());
            if(!pubDate) pubDate = (new Date()).getTime();
            
            let createdBy = null;
            if(item.creator) createdBy = item.creator;
            if(item.author) createdBy = item.author;

            let insItem:ITypes.item = {
                stub:shortid.generate(),
                source_id:source.id,
                link:item.link,
                text:item.title,
                created_by:(item.creator?item.creator:null),
                dt_pub:pubDate,
                dt_ins:(new Date()).getTime(),
                // raw:JSON.stringify(item)
            }

            itemReturn.push(insItem);

            await db.q(`INSERT INTO items SET ?`,[insItem]).catch(e=>console.log(e));

            return;

        }));

        console.log(`duplicates: ${duplicates}`);

        return itemReturn;

    }

};