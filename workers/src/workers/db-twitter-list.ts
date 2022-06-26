import Config from "../config/workers.json";

import {db} from "../lib/services/db";
import Tools from "../lib/tools";

import Twitter from "../lib/services/twitter";
import twitter from "twitter";

let timers:NodeJS.Timer[] = [];

// LIST PROCESSING
const TwitterList = async (feed:any)=>{

  console.log(`TICK @ Twitter List ${feed.name} @${new Date().getTime()}`);

  const startTime = (new Date()).getTime();

  let numInserted:number = 0,
    numLinksInserted:number = 0,
    numMediaInserted:number = 0,
    numInsertedRejected:number = 0;

  // Get List
  const list = await Twitter.list({list_id:feed.ref,tweet_mode:"extended"})
    .catch(e=>console.log(e));

  console.log(`tweets: ${list ? list.length : undefined}`);

  // Process Tweet
  await Tools.asyncForEach(list,async (tweet:twitter.ResponseData)=>{

    if(!tweet.full_text) throw "No full text."

    // Source Insert/Update
    let source_id:number;

    const sources = await db.q({text:`SELECT * FROM feed_item_sources WHERE name = $1`,values:[tweet.user.screen_name]});

    if(sources.rowCount < 1) {

      const inserted = await db.q({text:`INSERT INTO feed_item_sources (name,feed_id,thumbnail,ref) VALUES($1,$2,$3,$4) RETURNING id`,values:[
        tweet.user.screen_name,
        feed.id,
        tweet.user.profile_image_url_https,
        tweet.id_str
      ]});

      if(inserted && inserted.rowCount > 0) {
        source_id = inserted.rows[0].id
      }

    } else {
      source_id = sources.rows[0].id;
    }

    if(!source_id) return;

    // Check if tweet exists
    const tweetCallback = await db.q({
        text:"SELECT * FROM feed_items WHERE source_id = $1 AND text = $2",
        values:[source_id,tweet.full_text]
      })
      .catch(e=>{console.log(e)});
    
    if(tweetCallback.rowCount > 0) {
      
      numInsertedRejected++; 
      return;

    }

    if(tweet.retweeted_status) {

      numInsertedRejected++
      return;

    }

    // Insert tweet
    const itemInsert = await db.q({
        text:"INSERT INTO feed_items (source_id,feed_id,text,time_created,time_published,ref) VALUES($1,$2,$3,$4,$5) RETURNING id",
        values:[
          source_id,
          feed.id,
          tweet.full_text,
          Math.round(new Date().getTime()/1000),
          Math.round(new Date(tweet.created_at).getTime()/1000),
          tweet.id_str
        ]
      })
      .catch(e=>{console.log(e)});

    if(itemInsert.rowCount < 1) throw "insert failed";

    const itemId = itemInsert.rows[0].id;
    numInserted++;

    // Process entites
    if(tweet.entities) {

      // URLS
      if(tweet.entities.urls) {

        await Tools.asyncForEach(tweet.entities.urls,async (url:any)=>{

          const insertedURL = await db.q({
            text:"INSERT INTO feed_item_links (item_id,ref) VALUES($1,$2)",
            values:[itemId,url.expanded_url]
          }).catch(e=>console.log(e));

          if(insertedURL) numLinksInserted++;

          return;

        });

      }

      if(tweet.entities.media) {

        await Tools.asyncForEach(tweet.entities.media,async (media:any)=>{
          
          const insertedURL = await db.q({
            text:"INSERT INTO feed_item_media (item_id,ref) VALUES($1,$2)",
            values:[itemId,media.media_url_https]
          }).catch(e=>console.log(e));

          if(insertedURL) numMediaInserted++;

          return;

        });

      }

    }

    return;

  });
  
  console.log(
`> inserted ${numInserted} @${(new Date()).getTime() - startTime}ms
  rejected inserts: ${numInsertedRejected}
  links: ${numLinksInserted}, media: ${numMediaInserted}
`
);
  
return;

};

// INIT
(async () => {

  console.log(new Date());

  const feeds = await db.q(`SELECT * FROM feeds WHERE type = 'tl'`).catch(e=>{
    console.log("DBERROR");
    console.log(e); 
  });
  if(feeds.rowCount < 1) return;
  
  feeds.rows.forEach((list:any)=>{
    
    const time = Config.twitterlist.timer;
    const startAt = Math.round(Math.random() * Config.twitterlist.timer_offset);
    timers.push(setTimeout(()=>{
      TwitterList(list);
      setInterval(()=>TwitterList(list),time)
    },startAt));

    console.log(`INTERVAL ${list.name} (every ${time}ms in ${startAt}ms)`);

  });
  console.log(`timers: ${timers.length}`);

})();
