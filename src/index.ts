/**
 * This is an example Worker project.
 *
 *  It allows you to interact with a D1 database from an external app.
 *	The project is heavily inspired from: https://github.com/elithrar/http-api-d1-example
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Hono } from 'hono';
import { bearerAuth } from 'hono/bearer-auth';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';

type Bindings = {
	API_KEY: string;
	DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', prettyJSON(), logger(), async (c, next) => {
	const auth = bearerAuth({ token: c.env.API_KEY });
	return auth(c, next);
});

/**
 * Execute the `stmt.all()` method.
 * https://developers.cloudflare.com/d1/build-with-d1/d1-client-api/#await-stmtall
 */

app.post('/api/all', async (c) => {
	try {
		let { query, params } = await c.req.json();
		let stmt = c.env.DB.prepare(query);
		if (params) {
			stmt = stmt.bind(params);
		}

		const result = await stmt.all();
		return c.json(result);
	} catch (err) {
		return c.json({ error: `Failed to run query: ${err}` }, 500);
	}
});

/**
 * Execute the `db.exec()` method.
 * https://developers.cloudflare.com/d1/build-with-d1/d1-client-api/#await-dbexec
 */

app.post('/api/exec', async (c) => {
	try {
		let { query } = await c.req.json();
		let result = await c.env.DB.exec(query);
		return c.json(result);
	} catch (err) {
		return c.json({ error: `Failed to run query: ${err}` }, 500);
	}
});

/**
 * Execute the `db.batch()` method.
 * https://developers.cloudflare.com/d1/build-with-d1/d1-client-api/#dbbatch
 */

app.post('/api/batch', async (c) => {
	try {
		let { batch } = await c.req.json();
		let stmts = [];
		for (let query of batch) {
			let stmt = c.env.DB.prepare(query.query);
			if (query.params) {
				stmts.push(stmt.bind(query.params));
			} else {
				stmts.push(stmt);
			}
		}
		const results = await c.env.DB.batch(stmts);
		return c.json(results);
	} catch (err) {
		return c.json({ error: `Failed to run query: ${err}` }, 500);
	}
});

export default app;
