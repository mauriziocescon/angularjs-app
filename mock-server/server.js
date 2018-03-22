const path = require('path');
const jsonServer = require('json-server');
const app = jsonServer.create();
const dbUrl = require('./db/constants').dbUrl;
const router = jsonServer.router(dbUrl);
const middlewares = jsonServer.defaults({
  static: 'dist',
});

const delayMiddleware = require('./middlewares/delay');
const errosMiddleware = require('./middlewares/errors');

// set the port of our application
// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 5000;

// Middlewares
app.use(middlewares);
app.use(delayMiddleware.delay);
app.use(errosMiddleware.error);

// Mount the router based on db.json
app.use('/api', router);

// Fallback on frontend routes
app.get('*', (req, res) => {
  // load the single view file (frontend will handle the page changes on the front-end)
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start listening
app.listen(port, () => {
  console.log(`JSON Server is running! Open the browser at http://localhost:${port}`);
});
