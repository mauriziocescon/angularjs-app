/**
 * Take a look at @{Link http://frisbyjs.com/docs/api/}
 */
const frisby = require("frisby");
const Joi = frisby.Joi;

it("Get jsonplaceholder comments", (done) => {
    frisby
        .get("https://jsonplaceholder.typicode.com/comments?postId=1")
        .expect("status", 200)
        // .expect("header", {
        //     "Content-Type": "application/json; charset=utf-8",
        // })
        // .expect("jsonTypes", "*", {
        //     postId: Joi.number(),
        //     id: Joi.number(),
        //     name: Joi.string(),
        //     email: Joi.string(),
        //     body: Joi.string(),
        // })
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
