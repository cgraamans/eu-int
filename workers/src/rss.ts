import Parser from "rss-parser";
import DB from "./lib/services/db";

let parser = new Parser();

(async () => {

  let feed = await parser.parseURL('https://www.reddit.com/.rss');
  console.log(feed.title);

  feed.items.forEach(item => {
    console.log(item.title + ':' + item.link)
  });

})();