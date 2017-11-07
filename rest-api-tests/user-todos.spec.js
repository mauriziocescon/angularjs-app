const frisby = require("frisby");

/**
 * Take a look at @{Link http://frisbyjs.com/docs/api/}
 */
frisby.create("Get jsonplaceholder todos")
    .get("https://jsonplaceholder.typicode.com/todos")
    //.inspectJSON()
    .expectStatus(200)
    .expectHeaderContains("Content-Type", "application/json; charset=utf-8")
    .expectJSONLength("*", 4)   // 4 fields for each todo
    .expectJSONTypes("*", {
        userId: Number,
        id: Number,
        title: String,
        completed: Boolean
    })
    .toss();
