import Config from "./config/workers.json";

import {db} from "./lib/services/db";
import Tools from "./lib/tools";

import Twitter from "./lib/services/twitter";
import twitter from "twitter";

let timers:NodeJS.Timer[] = [];

// LIST PROCESSING
const TwitterList = async (feed:any)=>{

  console.log(`TICK @ Twitter List ${feed.name} @${new Date().getTime()}`);

  const startTime = (new Date()).getTime();

//   // Get List
  const list = await Twitter.list({list_id:feed.ref,tweet_mode:"extended"})
    .catch(e=>console.log(e));
  
  // console.log(list);

  console.log(`tweets: ${list ? list.length : undefined}`);

  let numInserted:number = 0,
    numLinksInserted:number = 0;

  // Process Tweet
  await Tools.asyncForEach(list,async (tweet:twitter.ResponseData)=>{

    if(!tweet.full_text) throw "No full text."

    // Source Insert/Update
    let source_id:number;

    const sources = await db.q({text:`SELECT * FROM item_sources WHERE name = $1`,values:[tweet.user.screen_name]});
    // console.log(sources);

    if(sources.rowCount < 1) {
      
      const inserted = await db.q({text:`INSERT INTO item_sources (name,feed_id) VALUES($1,$2) RETURNING id`,values:[tweet.user.screen_name,feed.id]});
      // console.log(inserted);

      if(inserted && inserted.rowCount > 0) {
        source_id = inserted.rows[0].id
      }

    } else {
      source_id = sources.rows[0].id;
    }

    if(!source_id) return;

    console.log(`SOURCE: ${source_id}`);

    // // Check if tweet exists
    // const tweetCallback = await db.q("SELECT * FROM euint_items WHERE source_id = ? AND text = ?",[source_id,tweet.full_text])
    //   .catch(e=>{console.log(e)});
    
//     // if(tweetCallback && tweetCallback.length > 0) return;

//     // Insert tweet
//     const itemInsert = await db.q("INSERT INTO euint_items SET ?",[{
//       source_id:source_id,
//       text:tweet.full_text,
//       published_at:(new Date(tweet.created_at)).getTime(),
//       created_at:(new Date()).getTime(),
//     }]);

//     // if(!itemInsert || !itemInsert.insertId) throw "insert failed";
//     numInserted++;

//     // Process entites
//     if(tweet.entities) {

//       // console.log(tweet.entities)

//       // URLS
//       if(tweet.entities.urls) {

//         await Tools.asyncForEach(tweet.entities.urls,async (url:any)=>{

//           const insertedURL = await db.q("INSERT INTO euint_item_links SET ?",[{
//             // item_id: itemInsert.insertId,
//             ref:url.expanded_url
//           }]);

//           // if(insertedURL && insertedURL.insertId && insertedURL.insertId > 0) numLinksInserted++;

//           return;

//         });

//       }

//       if(tweet.entities.media) {


//         await Tools.asyncForEach(tweet.entities.media,async (media:any)=>{
          
//           const insertedURL = await db.q("INSERT INTO euint_item_links SET ?",[{
//             // item_id: itemInsert.insertId,
//             ref:media.media_url_https
//           }]);

//           // if(insertedURL && insertedURL.insertId && insertedURL.insertId > 0) numLinksInserted++;

//           return;

//         });

//       }

//     }

    return;

  });
  
  console.log(`inserted: ${numInserted}`);
  console.log(`links: ${numLinksInserted}`);

  console.log(`process: ${(new Date()).getTime() - startTime}ms`)

  return;

};

// INIT
(async () => {

  // console.log(await db.q(`SELECT NOW()`));

  const feeds = await db.q(`SELECT * FROM feeds WHERE type = 'tl'`).catch(e=>{
    console.log("DBERROR");
    console.log(e); 
  });
  if(feeds.rowCount < 1) return;
  

  // console.log(feeds.rows);
  feeds.rows.forEach((list:any)=>{
    
    console.log(list);
    
    const time = Math.round(Math.random() * Config.twitterlist.timer_offset) + Config.twitterlist.timer;
    console.log(`INTERVAL ${list.name} - ${time}ms`);
    timers.push(setInterval(()=>TwitterList(list),time))

  });
  // Math.round(Math.random() * 180000) + Config.twitterlist.timer
  console.log(`timers: ${timers.length}`);

})();
