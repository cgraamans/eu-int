import Config from "../config/workers.json";

import {db} from "../lib/services/db";
import Tools from "../lib/tools";

import Reddit from "../lib/services/reddit";
import snoowrap from "snoowrap";

let timers:NodeJS.Timer[] = [];

// LIST PROCESSING
const RedditList = async (feed:any)=>{

  console.log(`TICK @ REDDIT List ${feed.name} @${new Date().getTime()}`);

  const startTime = (new Date()).getTime();

  let numInserted:number = 0,
    numLinksInserted:number = 0,
    numMediaInserted:number = 0,
    numInsertedRejected:number = 0;

  const list = await Reddit.client.getSubreddit(feed.ref).getHot();

  console.log(list);

  await Tools.asyncForEach(list,async (post:snoowrap.Submission)=>{

    // Source Insert/Update
    let source_id:number;

    const sources = await db.q({text:`SELECT * FROM feed_sources WHERE stub = $1`,values:[post.author.name]});

    if(sources.rowCount < 1) {
      
      const inserted = await db.q({text:`INSERT INTO feed_sources (name,stub,feed_id,thumbnail,ref) VALUES($1,$2,$3,$4,$5) RETURNING id`,values:[
        post.author.name,
        post.author.name,
        feed.id,
        post.author.icon_img,
        post.author.name
      ]});

      if(inserted && inserted.rowCount > 0) {
        source_id = inserted.rows[0].id
      }

    } else {
      source_id = sources.rows[0].id;
    }

    if(!source_id) return;

    // Check if post exists
    const tweetCallback = await db.q({
      text:"SELECT * FROM feed_items WHERE source_id = $1 AND text = $2",
      values:[source_id,post.title]
    })
    .catch(e=>{console.log(e)});

    if(tweetCallback.rowCount > 0) {
      
      numInsertedRejected++; 
      return;

    }

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

  const feeds = await db.q(`SELECT * FROM feeds WHERE type = 'rdt'`).catch(e=>{
    console.log("DBERROR");
    console.log(e); 
  });
  if(feeds.rowCount < 1) return;
  
  feeds.rows.forEach((list:any)=>{
    
    const time = Config.twitterlist.timer;
    const startAt = Math.round(Math.random() * Config.reddit.timer_offset);
    timers.push(setTimeout(()=>{
      RedditList(list);
      setInterval(()=>RedditList(list),time)
    },startAt));

    console.log(`INTERVAL ${list.name} (every ${time}ms in ${startAt}ms)`);

  });
  console.log(`timers: ${timers.length}`);

})();
