/* 

  DROP TABLE CONSTRAINTS 
  
*/

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


/* 

Feeds & Items 

*/

CREATE TABLE IF NOT EXISTS feeds (
  id SERIAL PRIMARY KEY,
  type VARCHAR(3) NOT NULL,
  ref VARCHAR NOT NULL,
  name TEXT NOT NULL
);

/* INITIAL FEEDS LIST */
INSERT INTO feeds (type, ref, name) VALUES ('twl','1133825663453093889','EU News');
INSERT INTO feeds (type, ref, name) VALUES ('twl','1132096927535906816','EU Official');
INSERT INTO feeds (type, ref, name) VALUES ('twl','1184569900477616128','EU Journalists');
-- INSERT INTO item_feeds (type, ref, name) VALUES ('tl','1184625022490595332','#OSINT');
INSERT INTO feeds (type, ref, name) VALUES ('rdt','EUNews','r/EUNews');
INSERT INTO feeds (type, ref, name) VALUES ('rdt','EuropeanUnion','r/EuropeanUnion');
INSERT INTO feeds (type, ref, name) VALUES ('rdt','EuropeanCulture','r/EuropeanCulture');
INSERT INTO feeds (type, ref, name) VALUES ('rdt','EUTech','r/EUTech');

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
  thumbnail TEXT
);

CREATE TABLE IF NOT EXISTS feed_items (
  id SERIAL PRIMARY KEY,
  uuid TEXT NOT NULL,
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
  password VARCHAR(256) NOT NULL
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
  date_expire BIGINT NOT NULL,
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
  uuid TEXT UNIQUE NOT NULL,
  user_id INTEGER REFERENCES users (id) NOT NULL,
  blog_id INTEGER REFERENCES blogs (id) NOT NULL,
  date_created BIGINT NOT NULL,
  date_updated BIGINT NOT NULL,
  title TEXT NOT NULL,
  text TEXT NOT NULL
);

insert into blog_items (uuid,user_id,blog_id, date_created,date_updated,text,title) VALUES(
  '0-0-0-0',
  1,
  1,
  extract(epoch from now()),
  extract(epoch from now()),
  '# DOLOR SIT AMET',
  'EUREM IPSUM'
);



/*

TODO:

-- insert into users (name,nick,password) VALUES('API_DISCORD','xyz');

data_countries
data_cities
data_people
data_keywords

*/