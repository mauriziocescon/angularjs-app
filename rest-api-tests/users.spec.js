const frisby = require("frisby");

/**
 * Take a look at @{Link http://frisbyjs.com/docs/api/}
 */
frisby.create("Get jsonplaceholder users")
    .get("https://jsonplaceholder.typicode.com/users?id=10")
    //.inspectJSON()
    .expectStatus(200)
    .expectHeaderContains("Content-Type", "application/json; charset=utf-8")
    .expectJSONLength("*", 8)   // 8 fields for each user
    .expectJSONTypes("*", {
        id: Number,
        name: String,
        username: String,
        email: String,
        address: {
            street: String,
            suite: String,
            city: String,
            zipcode: String,
            geo: {
                lat: String,
                lng: String
            }
        },
        phone: String,
        website: String,
        company: {
            name: String,
            catchPhrase: String,
            bs: String
        }
    })
    .toss();
