const path = require("path");
const jsonServer = require("json-server");
const app = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "./db.json"));
const middlewares = jsonServer.defaults({
    static: "dist",
});

// Add middlewares
app.use(middlewares);

// Simulate server side delay
app.use((req, res, next) => {
    const randomOutcome = Math.random();
    if (randomOutcome < 0.5) {
        setTimeout(next, Math.floor(( Math.random() * 10000 ) + 100));
    } else {
        next();
    }
});

// Simulate server side errors
app.use((req, res, next) => {
    const randomOutcome = Math.random();
    if (randomOutcome < 0.1 && req.path.startsWith("/api/")) {
        res.status(500).jsonp({
            error: "Error message here",
        });
    } else {
        // Continue to JSON Server router
        next();
    }
});

// Mount the router based on db.json
app.use("/api", router);

// Fallback on frontend routes
app.get("*", (req, res) => {
    // load the single view file (frontend will handle the page changes on the front-end)
    res.sendFile(path.join(__dirname, "../dist/index.html"));
});

// Start listening
app.listen(5000, () => {
    console.log("JSON Server is running! Open the browser at http://localhost:5000");
});
