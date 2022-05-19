/* 

  DROP TABLE CONSTRAINTS 
  
*/

DROP TABLE IF EXISTS feeds CASCADE;
DROP TABLE IF EXISTS item_sources CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS item_links CASCADE;
DROP TABLE IF EXISTS item_media CASCADE;

/* 

Feeds & Items 

*/

CREATE TABLE IF NOT EXISTS feeds (
  id SERIAL PRIMARY KEY,
  type CHAR(2) NOT NULL,
  ref VARCHAR NOT NULL,
  name TEXT NOT NULL
);

/* INITIAL FEEDS LIST */
INSERT INTO feeds (type, ref, name) VALUES ('tl','1133825663453093889','EU News');

CREATE TABLE IF NOT EXISTS item_sources (
  id SERIAL PRIMARY KEY,
  feed_id INTEGER REFERENCES feeds (id) NOT NULL,
  name VARCHAR NOT NULL,
  ref TEXT
);

CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  source_id INTEGER REFERENCES item_sources (id) NOT NULL,
  title TEXT NOT NULL,
  ref TEXT NOT NULL,
  time_created BIGINT NOT NULL,
  time_published BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS item_links (
  id SERIAL PRIMARY KEY,
  item_id INTEGER REFERENCES items (id) NOT NULL,
  ref TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS item_media (
  id SERIAL PRIMARY KEY,
  item_id INTEGER REFERENCES items (id) NOT NULL,
  ref TEXT NOT NULL
);

/*

TODO:

users
user_tokens

item_locations

data_countries
data_cities
data_people
data_keywords


*/