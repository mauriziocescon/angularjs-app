const jsonServer = require('json-server');

// set mocks-obj to the router
const mocks = require('./db').mocks;
const router = jsonServer.router(mocks);

// expose router and db behind json-server
// (@{link https://github.com/typicode/lowdb})
exports.getDb = () => {
  return router.db;
};

exports.getRouter = () => {
  return router;
};
