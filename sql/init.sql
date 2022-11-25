/* 

  DROP TABLE CONSTRAINTS 
  
*/

DROP TABLE IF EXISTS articles_youtube CASCADE;
DROP TABLE IF EXISTS articles_discord CASCADE;
DROP TABLE IF EXISTS articles_twitter CASCADE;
DROP TABLE IF EXISTS articles_reddit CASCADE;
DROP TABLE IF EXISTS articles_blog CASCADE;
DROP TABLE IF EXISTS articles_mastodon CASCADE;


DROP TABLE IF EXISTS localization_countries CASCADE;
DROP TABLE IF EXISTS localization_nouns CASCADE;
DROP TABLE IF EXISTS localization_shapes CASCADE;
DROP TABLE IF EXISTS localization_cities CASCADE;

DROP TABLE IF EXISTS link_local_articles CASCADE;

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS user_comments CASCADE;
DROP TABLE IF EXISTS user_saves CASCADE;

DROP TABLE IF EXISTS discord_xp;

/* CLEAN TABLES FROM PREVIOUS EU-INT BUILD */
DROP TABLE IF EXISTS feeds CASCADE;
DROP TABLE IF EXISTS feed_items CASCADE;
DROP TABLE IF EXISTS feed_item_links CASCADE;
DROP TABLE IF EXISTS feed_item_media CASCADE;
DROP TABLE IF EXISTS feed_item_locations CASCADE;
DROP TABLE IF EXISTS feed_sources CASCADE;
DROP TABLE IF EXISTS feed_source_categories CASCADE;
DROP TABLE IF EXISTS blogs CASCADE;
DROP TABLE IF EXISTS blog_items CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS user_role_link CASCADE;
DROP TABLE IF EXISTS user_tokens CASCADE;
DROP TABLE IF EXISTS calendars CASCADE;
DROP TABLE IF EXISTS calendar_items CASCADE;


/* START */

-- Template
CREATE TABLE IF NOT EXISTS feeds (
  id SERIAL PRIMARY KEY,
);

/* 

Feeds & Items 

*/

CREATE TABLE IF NOT EXISTS feeds (
  id SERIAL PRIMARY KEY,
  type VARCHAR(3) NOT NULL,
  ref VARCHAR(128),
  name TEXT NOT NULL
);

/*

  Structure:

HOME
NEWS
    - Reddit
    - Twitter
    - Discord

    - Official 
      - Official Twitter (Commission + Devolved agencies)
      - Council Twitter
      - MEP Twitter

*/


/* INITIAL FEEDS LIST */


-- Reddit
  INSERT INTO feeds (type, ref, name) VALUES ('rdt','EUNews','r/EUNews');
  INSERT INTO feeds (type, ref, name) VALUES ('rdt','EuropeanUnion','r/EuropeanUnion');
  INSERT INTO feeds (type, ref, name) VALUES ('rdt','EUTech','r/EUTech');
  INSERT INTO feeds (type, ref, name) VALUES ('rdt','EuropeanArmy','r/EuropeanArmy');
  INSERT INTO feeds (type, ref, name) VALUES ('rdt','EUSpace','r/EUSpace');

-- Twitter
  INSERT INTO feeds (type, ref, name) VALUES ('twl','31066001', 'EU Representations');
  INSERT INTO feeds (type, ref, name) VALUES ('twl','34528166', 'EU Agencies');
  INSERT INTO feeds (type, ref, name) VALUES ('twl','31067541', 'EU Departments');
  INSERT INTO feeds (type, ref, name) VALUES ('twl','30377207', 'European Council');
  INSERT INTO feeds (type, ref, name) VALUES ('twl','1138737420671885312', 'MEPs');

-- Discord
  INSERT INTO feeds (type, name) VALUES ('dsc','Forum Gotterfunken');


-- INSERT INTO feeds (type, ref, name) VALUES ('twl','1184569900477616128','EU Journalists');
-- INSERT INTO item_feeds (type, ref, name) VALUES ('tl','1184625022490595332','#OSINT');

CREATE TABLE IF NOT EXISTS feed_source_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  ref TEXT
);

CREATE TABLE IF NOT EXISTS feed_sources (
  id SERIAL PRIMARY KEY,
  stub TEXT NOT NULL, -- nickname on twitter or name reddit
  feed_id INTEGER REFERENCES feeds (id) NOT NULL,
  category_id INTEGER REFERENCES feed_source_categories (id),
  name VARCHAR NOT NULL, -- display name on twitter or name reddit
  ref TEXT,
  thumbnail TEXT,
  isActive BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS feed_items (
  id SERIAL PRIMARY KEY,
  source_id INTEGER REFERENCES feed_sources (id) NOT NULL,
  feed_id INTEGER REFERENCES feeds (id) NOT NULL,
  text TEXT NOT NULL,
  ref TEXT NOT NULL,
  date_created BIGINT NOT NULL,
  date_published BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS feed_item_links (
  item_id INTEGER REFERENCES feed_items (id) NOT NULL,
  ref TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS feed_item_media (
  item_id INTEGER REFERENCES feed_items (id) NOT NULL,
  ref TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS feed_item_locations (
  item_id INTEGER REFERENCES feed_items (id) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(64) NOT NULL,
  nick VARCHAR(64) NOT NULL,
  email VARCHAR(256) NOT NULL,
  password VARCHAR(256) NOT NULL,
  bio TEXT
);

CREATE TABLE IF NOT EXISTS user_roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(32) NOT NULL,
  level INTEGER NOT NULL,
  color VARCHAR(7) NOT NULL
);

insert into user_roles (name,level,color) VALUES('ADMIN',99,'#005716');

CREATE TABLE IF NOT EXISTS user_role_link (
  user_id INTEGER REFERENCES users (id) NOT NULL,
  role_id INTEGER REFERENCES user_roles (id) NOT NULL
);

/* INITIAL USERS LIST */

insert into users (name,nick,email,password) VALUES('DUMMY','DUMMY','admin@gotterfunken.eu','$2a$12$V2VGE8omaz8..SDY1S3ztuBibni/6kJmeXqiSCVElgteiyHpxl5CS'); -- oibuck
insert into user_role_link (user_id,role_id) VALUES(1,1);

CREATE TABLE IF NOT EXISTS user_tokens (
  user_id INTEGER REFERENCES users (id) NOT NULL,
  date_created BIGINT NOT NULL,
  date_expired BIGINT NOT NULL,
  token VARCHAR(128),
  is_api BOOLEAN NOT NULL
);

ALTER TABLE user_tokens ALTER COLUMN is_api SET DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS blogs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users (id) NOT NULL,
  stub TEXT UNIQUE NOT NULL,
  name VARCHAR(128) NOT NULL
);

insert into blogs (user_id,stub,name) VALUES(1,'test-blog','Test Blog');

CREATE TABLE IF NOT EXISTS blog_items (
  id SERIAL PRIMARY KEY,
  stub TEXT UNIQUE NOT NULL,
  user_id INTEGER REFERENCES users (id) NOT NULL,
  blog_id INTEGER REFERENCES blogs (id) NOT NULL,
  date_created BIGINT NOT NULL,
  date_updated BIGINT NOT NULL,
  title TEXT NOT NULL,
  text TEXT NOT NULL,
  text_short TEXT NULL
);

insert into blog_items (stub,user_id,blog_id, date_created,date_updated,text,title,text_short) VALUES(
  'eurem-ipsum',
  1,
  1,
  extract(epoch from now()),
  extract(epoch from now()),
  '# DOLOR SIT AMET\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris aliquam mauris orci, non tempor ante dignissim sit amet. Pellentesque pharetra, nibh sed sodales venenatis, nulla felis egestas metus, non tincidunt magna odio vitae nibh. Suspendisse dignissim accumsan felis ac pulvinar. Mauris purus orci, ultricies in ex id, luctus aliquet dolor. Nullam vel ex fringilla, vestibulum sapien vel, accumsan augue. Praesent vitae lorem vel leo ullamcorper aliquet vitae in nunc. Pellentesque et tortor ex. Phasellus eleifend efficitur nisl at euismod. Maecenas et dictum eros. Proin porta, felis sed viverra commodo, tortor nisi mollis odio, egestas eleifend velit velit quis nisi. Nunc vestibulum ante vitae tempor pulvinar. Proin rhoncus lobortis odio, vitae aliquet felis. Aliquam non felis a urna dapibus lobortis.',
  'EUREM IPSUM',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris aliquam mauris orci, non tempor ante dignissim sit amet.'
);

CREATE TABLE IF NOT EXISTS calendars (
  id SERIAL PRIMARY KEY,
  stub TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL
);

insert into calendars (stub,name) VALUES(
  'main',
  'Forum Gotterfunken Main Calendar'
 );

CREATE TABLE IF NOT EXISTS calendar_items (
  id SERIAL PRIMARY KEY,
  calendar_id INTEGER REFERENCES calendars (id) NOT NULL,
  google_id VARCHAR(128) NOT NULL,
  summary TEXT NOT NULL,
  description TEXT,
  creator TEXT NOT NULL,
  date_start  TEXT NOT NULL,
  date_end  TEXT NOT NULL,
  is_event BOOLEAN NOT NULL
);

/*

TODO:

data_countries
data_cities
data_people
data_keywords

*/