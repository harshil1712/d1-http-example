# Build an API for Cloudflare D1

This example demonstrates how to create an API to access [Cloudflare D1](https://developers.cloudflare.com/d1/) from an external app.

> Note: This example is meant for demonstration purposes only. Please make sure you follow the best security practices to use it in production.

## Built with

- [Hono](https://hono.dev/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)

## Getting Started

### Prerequisites

- Sign up for a [Cloudflare account](https://dash.cloudflare.com/sign-up/workers-and-pages).
- Install [npm](https://docs.npmjs.com/getting-started).
- Install [Node.js](https://nodejs.org/en/).

### 1. Clone the project

Clone the project on your local machine by running the command:

```sh
$ git clone https://github.com/harshil1712/d1-http-example.git
```

### 2. Install dependecies

Install the required dependencies using the following command:

```sh
$ npm i
```

### 3. Add API_KEY

Generate an API Key with the following command:

```sh
openssl rand -base64 32
```

Copy the generated value.

Next, rename `.dev.vars.example` to `.dev.vars`. Replace `YOUR_API_KEY` with the value generated above.

### 4. Create a D1 Database

Execute the following command to create a new D1 database.

```sh
$ npx wrangler d1 create d1-http-example
```

You might be asked to login to your Cloudflare. Once logged in, the command will create a new D1 database.

Make a note of the displayed `database_name` and `database_id`. You will use this to reference to the database by creating a [binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/).

In the `wrangler.toml` file, update the value for `database_name` and `database_id`.

### 5. Create a table

Create a table in your D1 database with the schema from `schemas/schema.sql` file using the following command:

```sh
$ npx wrangler d1 execute d1-http-example --file=./schemas/schema.sql
```

### 6. Start the development server

Execute the following command to start the development.

```sh
$ npm run dev
```

Your API will be availabe at `http://localhost:8787`.

To test the API, execute the following cURL commands. Make sure to replace `YOUR_API_KEY` with the correct value.

```sh
---
header: /api/all
---
$ curl -H "Authorization: Bearer YOUR_API_KEY" "http://localhost:8787/api/all" --data '{"query": "SELECT title FROM posts WHERE id=?", "params":1}'
```

```sh
---
header: /api/batch
---
$ curl -H "Authorization: Bearer YOUR_API_KEY" "http://localhost:8787/api/batch" --data '{"batch": [ {"query": "SELECT title FROM posts WHERE id=?", "params":1},{"query": "SELECT id FROM posts"}]}'
```

```sh
---
header: /api/exec
---
$ curl -H "Authorization: Bearer YOUR_API_KEY" "localhost:8787/api/exec" --data '{"query": "INSERT INTO posts (author, title, body, post_slug) VALUES ('\''Harshil'\'', '\''D1 HTTP API'\'', '\''Learn to create an API to query your D1 database.'\'','\''d1-http-api'\'')" }'
```

### 7. Deploy the app

First, create a table in the remote (production) database. Execute the following command:

```sh
$ npx wrangler d1 execute d1-http-example --file=./schemas/schema.sql --remote
```

Next, deploy your application using the below command.

```sh
$ npx wrangler deploy
```

Lastly, add the `API_KEY` as the environment variable with the following command.

```sh
$ npx wrangler secret put API_KEY
```

Enter the value of your API key. Your API key will get added to your project. Using this value you can make secure API calls to your deployed API.
