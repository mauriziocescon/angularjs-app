/**
 * Take a look at @{Link http://frisbyjs.com/docs/api/}
 */
const frisby = require("frisby");
const Joi = frisby.Joi;

it("Get jsonplaceholder user-posts: status", (done) => {
    frisby
        .get("https://jsonplaceholder.typicode.com/posts?userId=10")
        .expect("status", 200)
        .done(done);
});

it("Get jsonplaceholder user-posts: jsonTypes", (done) => {
    frisby
        .get("https://jsonplaceholder.typicode.com/posts?userId=10")
        .expect("jsonTypes", "*", {
            userId: Joi.number(),
            id: Joi.number(),
            title: Joi.string(),
            body: Joi.string(),
        })
        .done(done);
});

it("Get jsonplaceholder user-posts: json", (done) => {
    frisby
        .get("https://jsonplaceholder.typicode.com/posts?userId=10")
        .then((response) => {
            // expectJSONLength("*", 4);   // 4 fields for each post
            // expectJSON("*", {
            //     userId: function(val) {
            //         expect(val).toBe(10);
            //     }, // Custom matcher callback
            // });
        })
        .done(done);
});
