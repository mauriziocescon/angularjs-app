const frisby = require("frisby");

/**
 * Take a look at @{Link http://frisbyjs.com/docs/api/}
 */
frisby.create("Get jsonplaceholder photos")
    .get("https://jsonplaceholder.typicode.com/photos?id=10")
    //.inspectJSON()
    .expectStatus(200)
    .expectHeaderContains("Content-Type", "application/json; charset=utf-8")
    .expectJSONLength("*", 5)   // 5 fields for each photo
    .expectJSON("*", {
        id: function(val) { expect(val).toBe(10); }, // Custom matcher callback
    })
    .expectJSONTypes("*", {
        albumId: Number,
        id: Number,
        title: String,
        url: String,
        thumbnailUrl: String
    })
    .toss();
