const faker = require('faker');

// Server sent events
exports.sse = (req, res, next) => {

    // sse setup
    res.sseSetup = () => {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
        });
    };

    // push msg
    res.sseSend = (event, data) => {
        res.write(`id: ${faker.random.uuid()}\nevent: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
        res.flush();
    };

    next();
};
