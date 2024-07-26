DROP TABLE IF EXISTS posts;
CREATE TABLE IF NOT EXISTS posts (
  id integer PRIMARY KEY AUTOINCREMENT,
  author text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  post_slug text NOT NULL
);

-- Remove this comment and uncomment the below statement to add data

-- INSERT INTO posts (author, title, body, post_slug) VALUES ('Harshil', 'D1 HTTP API', 'Learn to create an API to query your D1 database.','d1-http-api');