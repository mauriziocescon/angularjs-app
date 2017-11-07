const frisby = require("frisby");

/**
 * Take a look at @{Link http://frisbyjs.com/docs/api/}
 */
frisby.create("Get jsonplaceholder comments")
    .get("https://jsonplaceholder.typicode.com/comments?postId=1")
    //.inspectJSON()
    .expectStatus(200)
    .expectHeaderContains("Content-Type", "application/json; charset=utf-8")
    .expectJSONLength("*", 5)   // 5 fields for each comment
    .expectJSON("*", {
        postId: function(val) { expect(val).toBe(1); }, // Custom matcher callback
    })
    .expectJSONTypes("*", {
        postId: Number,
        id: Number,
        name: String,
        email: String,
        body: String
    })
    .toss();
