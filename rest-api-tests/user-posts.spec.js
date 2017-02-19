var frisby = require("frisby");

/**
 * Take a look at @{Link http://frisbyjs.com/docs/api/}
 */
frisby.create("Get jsonplaceholder posts")
    .get("http://jsonplaceholder.typicode.com/posts?userId=10")
    //.inspectJSON()
    .expectStatus(200)
    .expectHeaderContains("Content-Type", "application/json; charset=utf-8")
    .expectJSONLength("*", 4)   // 4 fields for each post
    .expectJSON("*", {
        userId: function(val) { expect(val).toBe(10); }, // Custom matcher callback
    })
    .expectJSONTypes("*", {
        userId: Number,
        id: Number,
        title: String,
        body: String
    })
    .toss();