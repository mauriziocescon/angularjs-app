const frisby = require("frisby");

/**
 * Take a look at @{Link http://frisbyjs.com/docs/api/}
 */
frisby.create("Get jsonplaceholder albums")
    .get("https://jsonplaceholder.typicode.com/albums?_page=1")
    //.inspectJSON()
    .expectStatus(200)
    .expectHeaderContains("Content-Type", "application/json; charset=utf-8")
    .expectJSONLength(10)       // 10 photos for each page
    .expectJSONLength("*", 3)   // 3 fields for each album
    .expectJSONTypes("*", {
        userId: Number,
        id: Number,
        title: String
    })
    .toss();
