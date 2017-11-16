const path = require("path");
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "./db.json"));
const middlewares = jsonServer.defaults({
  static: "dist"
});

// Add middlewares
server.use(middlewares);

// Simulate a server side error response
server.use((req, res, next) => {
  const randomOutcome = Math.random();
  if (randomOutcome < 0.1 && req.path.startsWith("/api/")) {
    res.status(500).jsonp({
      error: "Error message here"
    });
  } else {
    // Continue to JSON Server router
    next();
  }
});

// Mount the router based on db.json
server.use("/api", router);

// Fallback on frontend routes
server.get("*", (req, res) => {
  // load the single view file (frontend will handle the page changes on the front-end)
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

// Start listening
server.listen(5000, () => {
  console.log("JSON Server is running! Open the browser at http://localhost:5000");
});
