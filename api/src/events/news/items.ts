import {EUINT} from "../../../types";
import {db} from "../../services/db";
import {whereBuilder} from "../../lib/tools";

const AllowedRoutes:string[] = [
    "published",
    "created"
];

module.exports = {
    run: async (socket:EUINT.ExtendedSocket,event:string,args:{orderBy?:string,limit?:number,orderDir?:string,from?:string,id?:string,source?:string})=>{

        console.log(`!Event ${event} triggered...`);

        let wheres:string[] = [];
        let whereVals:any[] = [];

        if(args.from) {
            wheres.push("ni.id < (SELECT id FROM news_items WHERE stub = $1)");
            whereVals.push(args.from);
        }

        if(args.id) {
            wheres.push("stub = $1");
        }


        if(args.source) {
            wheres.push("isource.stub = $1");
        }

        if(!args.orderBy) args.orderBy = "time_created";
        if(!args.orderDir) args.orderDir = "DESC";

        if(!args.limit || args.limit > 50) args.limit = 25;

        const whereBuilt = whereBuilder(wheres);
        console.log(whereBuilt);

        // let query = `
        //     SELECT ni.text, ni.ref, ni.dt_created, ni.dt_published isource.name AS source_name, isource.thumbnail as source_thumbnail
        //     FROM news_items AS ni
        //     ${where ? "WHERE " + where : ""}
        //     INNER JOIN item_sources AS isource ON isource.id = ni.source_id
        //     ORDER BY ${ AllowedRoutes.includes(args.orderBy) ? "ni."+ args.orderBy : "ni.id" } ${args.orderDir === "ASC" ? "ASC" : "DESC"}}
        //     LIMIT ${args.limit};
        // `;

        // const items = await db.q({text:query,values:whereVals});
        // console.log('items::',items);

        return socket;

    }
};