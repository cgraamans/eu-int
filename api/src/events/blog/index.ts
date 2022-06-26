import Joi from "joi";
import {EUINT} from "../../../types";
import {db} from '../../services/db';

const AllowedRoutes:string[] = [
    "dt_created"
];

module.exports = {
    run: async (socket:EUINT.ExtendedSocket,event:string,args:{action?:string,orderBy?:string,text?:string,id?:string,from?:string,limit?:number,orderDir?:string})=>{

        let where = "";
        let whereVals = [];

        if(!args || !args.action) args = {action:"read"};
        
        if(args.from) {
            where = "b.id < (SELECT id FROM blog_items WHERE stub = $1)";
            whereVals.push(args.from);
        }

        if(args.id) {
            where = "stub = $1";
        }

        if(!args.limit) args.limit = 20;
        if(!args.orderBy) args.orderBy = "time_created";
        if(!args.orderDir) args.orderDir = "DESC";

        const sql = `SELECT b.text,b.title,b.dt_created,b.dt_modified, u.name as author FROM blog As b
            ${where}
            INNER JOIN users AS u on u.id = b.author
            ORDER BY ${ AllowedRoutes.includes(args.orderBy) ? args.orderBy : "dt_created" } ${args.orderDir === "ASC" ? "ASC" : "DESC"}
            LIMIT ${args.limit}
        `;

        console.log(sql);

        // await db.q()


        return socket;

    }
}