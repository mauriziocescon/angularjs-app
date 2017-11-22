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
            res.status(400).jsonp({
                error: "Bad Request",
            });
            return;
        }
        else if (choice < 0.22) {
            res.status(401).jsonp({
                error: "Unauthorized",
            });
            return;
        }
        else if (choice < 0.33) {
            res.status(403).jsonp({
                error: "Forbidden",
            });
            return;
        }
        else if (choice < 0.44) {
            res.status(404).jsonp({
                error: "Not Found",
            });
            return;
        }
        else if (choice < 0.55) {
            res.status(410).jsonp({
                error: "Gone",
            });
            return;
        }
        else if (choice < 0.66) {
            res.status(500).jsonp({
                error: "Internal Server Error",
            });
            return;
        }
        else if (choice < 0.77) {
            res.status(501).jsonp({
                error: "Not Implemented",
            });
            return;
        }
        else if (choice < 0.88) {
            res.status(503).jsonp({
                error: "Service Unavailable",
            });
            return;
        }
        else {
            res.status(550).jsonp({
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
app.listen(5000, () => {
    console.log("JSON Server is running! Open the browser at http://localhost:5000");
});
