import jsonServer from 'json-server';

import {mocks} from './db/index.js';

const router = jsonServer.router(mocks);

// expose router and db behind json-server
// (@{link https://github.com/typicode/lowdb})
export const getDb = () => router.db;
export const getRouter = () => router;

