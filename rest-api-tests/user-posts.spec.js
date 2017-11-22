/**
 * Take a look at @{Link http://frisbyjs.com/docs/api/}
 */
const frisby = require("frisby");
const Joi = frisby.Joi;

it("Get user-posts: status", (done) => {
    frisby
        .get("http://localhost:5000/posts?userId=10")
        .expect("status", 200)
        .done(done);
});

it("Get user-posts: jsonTypes", (done) => {
    frisby
        .get("http://localhost:5000/posts?userId=10")
        .expect("jsonTypes", "*", {
            userId: Joi.number(),
            id: Joi.number(),
            title: Joi.string(),
            body: Joi.string(),
        })
        .done(done);
});

it("Get user-posts: json", (done) => {
    frisby
        .get("http://localhost:5000/posts?userId=10")
        .then((response) => {
            response.json.forEach((post) => {
                expect(Object.keys(post).length).toBe(4); // 4 fields for each post
            });

            response.json.forEach((post) => {
                expect(post.userId).toBe(10); // id = 10
            });
        })
        .done(done);
});
