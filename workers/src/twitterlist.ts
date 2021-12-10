import Config from "./config/workers.json";

import DB from "./lib/services/db";
import Tools from "./lib/tools";

import Twitter from "./lib/services/twitter";
import twitter from "twitter";

let timers:NodeJS.Timer[] = [];

// LIST PROCESSING
const TwitterList = async (feed:any)=>{

  console.log(`TICK @ Twitter List ${feed.name}`);

  const startTime = (new Date()).getTime();

  // Get List
  const list = await Twitter.list({list_id:feed.ref,tweet_mode:"extended"})
    .catch(e=>console.log(e));
  
  console.log(`tweets: ${list ? list.length : undefined}`);

  let numInserted:number = 0,
    numLinksInserted:number = 0;

  // Process Tweet
  await Tools.asyncForEach(list,async (tweet:twitter.ResponseData)=>{

    if(!tweet.full_text) throw "No full text."

    // Source Insert/Update
    let source_id:number;

    const sources = await DB.q("SELECT * FROM euint_sources WHERE name = ?",[tweet.user.screen_name]);
    if(sources.length < 1) {
      
      const inserted = await DB.q("INSERT INTO euint_sources SET ?",[{
        feed_twitterlist:feed.id,
        name:tweet.user.screen_name
      }]);
      if(inserted && inserted.insertId && inserted.insertId > 0) {
        source_id = inserted.insertId
      }

    } else {
      source_id = sources[0].id;
    }

    if(!source_id) return;

    // Check if tweet exists
    const tweetCallback = await DB.q("SELECT * FROM euint_items WHERE source_id = ? AND text = ?",[source_id,tweet.full_text])
      .catch(e=>{console.log(e)});
    
    if(tweetCallback && tweetCallback.length > 0) return;

    // Insert tweet
    const itemInsert = await DB.q("INSERT INTO euint_items SET ?",[{
      source_id:source_id,
      text:tweet.full_text,
      published_at:(new Date(tweet.created_at)).getTime(),
      created_at:(new Date()).getTime(),
    }]);

    if(!itemInsert || !itemInsert.insertId) throw "insert failed";
    numInserted++;

    // Process entites
    if(tweet.entities) {

      // console.log(tweet.entities)

      // URLS
      if(tweet.entities.urls) {

        await Tools.asyncForEach(tweet.entities.urls,async (url:any)=>{

          const insertedURL = await DB.q("INSERT INTO euint_item_links SET ?",[{
            item_id: itemInsert.insertId,
            ref:url.expanded_url
          }]);

          if(insertedURL && insertedURL.insertId && insertedURL.insertId > 0) numLinksInserted++;

          return;

        });

      }

      if(tweet.entities.media) {


        await Tools.asyncForEach(tweet.entities.media,async (media:any)=>{
          
          const insertedURL = await DB.q("INSERT INTO euint_item_links SET ?",[{
            item_id: itemInsert.insertId,
            ref:media.media_url_https
          }]);

          if(insertedURL && insertedURL.insertId && insertedURL.insertId > 0) numLinksInserted++;

          return;

        });

      }

    }

    return;

  });
  
  console.log(`inserted: ${numInserted}`);
  console.log(`links: ${numLinksInserted}`);

  console.log(`process: ${(new Date()).getTime() - startTime}ms`)

  return;

};

// INIT
(async () => {

  const feeds = await DB.q("SELECT * FROM euint_feed_twitterlist",[])
  feeds.forEach((list:any)=>{
    timers.push(setInterval(()=>TwitterList(list), Math.round(Math.random() * Config.twitterlist.timer_offset) + Config.twitterlist.timer))
  })
  // Math.round(Math.random() * 180000) + Config.twitterlist.timer
  console.log(`timers: ${timers.length}`);

})();
