/**
 * Take a look at @{Link http://frisbyjs.com/docs/api/}
 */
const frisby = require("frisby");
const Joi = frisby.Joi;

it("Get jsonplaceholder post-comments: status", (done) => {
    frisby
        .get("https://jsonplaceholder.typicode.com/comments?postId=1")
        .expect("status", 200)
        .done(done);
});

it("Get jsonplaceholder post-comments: jsonTypes", (done) => {
    frisby
        .get("https://jsonplaceholder.typicode.com/comments?postId=1")
        .expect("jsonTypes", "*", {
            postId: Joi.number(),
            id: Joi.number(),
            name: Joi.string(),
            email: Joi.string(),
            body: Joi.string(),
        })
        .done(done);
});

it("Get jsonplaceholder post-comments: json", (done) => {
    frisby
        .get("https://jsonplaceholder.typicode.com/comments?postId=1")
        .then((response) => {
            // expectJSONLength("*", 5); // 5 fields for each comment
            // expectJSON("*", {
            //     postId: function(val) {
            //         expect(val).toBe(1);
            //     }, // Custom matcher callback
            // });
        })
        .done(done);
});
