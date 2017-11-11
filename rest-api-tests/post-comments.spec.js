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
            response.json.forEach((comment) => {
                expect(Object.keys(comment).length).toBe(5); // 5 fields for each comment
            });

            response.json.forEach((comment) => {
                expect(comment.postId).toBe(1); // id = 1
            });
        })
        .done(done);
});
