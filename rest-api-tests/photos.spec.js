/**
 * Take a look at @{Link http://frisbyjs.com/docs/api/}
 */
const frisby = require("frisby");
const Joi = frisby.Joi;

it("Get jsonplaceholder photos", (done) => {
    frisby
        .get("https://jsonplaceholder.typicode.com/photos?id=10")
        .expect("status", 200)
        // .expect("header", {
        //     "Content-Type": "application/json; charset=utf-8",
        // })
        // .expect("jsonTypes", "*", {
        //     albumId: Joi.number(),
        //     id: Joi.number(),
        //     title: Joi.string(),
        //     url: Joi.string(),
        //     thumbnailUrl: Joi.string(),
        // })
        .then((response) => {
            // expectJSONLength("*", 5); // 5 fields for each photo
            // .expectJSON("*", {
            //     id: function(val) { expect(val).toBe(10); }, // Custom matcher callback
            // })
        })
        .done(done);
});
