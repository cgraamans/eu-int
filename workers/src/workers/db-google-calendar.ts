import {db} from "../lib/services/db";
import tools from "../lib/tools";

import Google from "../lib/services/google";

const timers = [];

const CalendarList = async () => {
    
    const from = new Date((new Date()).getTime()-36000000000);
    const to = new Date((new Date()).getTime()+36000000000);

    console.log(`INTERVAL ${(new Date()).getTime()}`);

    const calendar = await Google.Calendar({
        from:(from as unknown as string),
        to:(to as unknown as string)
    }).catch(e=>{console.log(e);})

    let numInserts = 0;

    await tools.asyncForEach(calendar,async (event:any)=>{

        // Check for Duplicates
        const duplicates = await db.q({
            text:'SELECT * FROM calendar_items WHERE google_id = $1',values:[
                event.id
            ]
        }).catch(e=>{console.log(e)});

        if(duplicates && duplicates.rowCount > 0) return;

        // Insert
        const sqlObj = {text:`INSERT INTO calendar_items (calendar_id,google_id,summary,description,creator,date_start,date_end,is_event) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,values:[
            1,
            event.id,
            event.summary,
            (event.description ? event.description : null),
            event.creator.email,
            (event.start.date ? event.start.date : event.start.dateTime),
            (event.start.date ? event.end.date : event.end.dateTime),
            (event.start.date ? 0 : 1)
        ]};

        const inserted = await db.q(sqlObj).catch(e=>{console.log(e)});
        if(inserted && inserted.rowCount > 0) numInserts++;

        return;

    });

    if(numInserts > 0) console.log(`${numInserts} entr${numInserts > 1 ? 'ies':'y'} inserted`);

}

// INIT
(async () => {

    console.log(new Date());
  
    CalendarList();

    const time = 120*1000;

    timers.push(setInterval(()=>CalendarList(),time));

    console.log(`INTERVAL (every ${time}ms)`);

  })();
  
  process.stdout.on('error', function( err ) {
    if (err.code == "EPIPE") {
        process.exit(0);
    }
});