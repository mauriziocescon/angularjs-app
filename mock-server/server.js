const path = require("path");
const jsonServer = require("json-server");
const app = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "./db.json"));
const middlewares = jsonServer.defaults({
    static: "dist",
});

// set the port of our application
// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 5000;

// Add middlewares
app.use(middlewares);

// Simulate server side delay
app.use((req, res, next) => {
    const randomOutcome = Math.random();
    if (randomOutcome < 0.35) {
        setTimeout(next, Math.floor(( Math.random() * 8000 ) + 100));
    } else {
        next();
    }
});

// Simulate server side errors
app.use((req, res, next) => {
    const randomOutcome = Math.random();
    if (randomOutcome < 0.01 && req.path.startsWith("/api/")) {
        const choice = Math.random();

        if (choice < 0.11) {
            return res.status(400).jsonp({
                error: "Bad Request",
            });
        }
        else if (choice < 0.22) {
            return res.status(401).jsonp({
                error: "Unauthorized",
            });
        }
        else if (choice < 0.33) {
            return  res.status(403).jsonp({
                error: "Forbidden",
            });
        }
        else if (choice < 0.44) {
            return res.status(404).jsonp({
                error: "Not Found",
            });
        }
        else if (choice < 0.55) {
            return res.status(410).jsonp({
                error: "Gone",
            });
        }
        else if (choice < 0.66) {
            return res.status(500).jsonp({
                error: "Internal Server Error",
            });
        }
        else if (choice < 0.77) {
            return res.status(501).jsonp({
                error: "Not Implemented",
            });
        }
        else if (choice < 0.88) {
            return res.status(503).jsonp({
                error: "Service Unavailable",
            });
        }
        else {
            return res.status(550).jsonp({
                error: "Permission denied",
            });
        }
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
app.listen(port, () => {
    console.log(`JSON Server is running! Open the browser at http://localhost:${port}`);
});
