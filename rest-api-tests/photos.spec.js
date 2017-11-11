/**
 * Take a look at @{Link http://frisbyjs.com/docs/api/}
 */
const frisby = require("frisby");
const Joi = frisby.Joi;

it("Get jsonplaceholder photos: status", (done) => {
    frisby
        .get("https://jsonplaceholder.typicode.com/photos?id=10")
        .expect("status", 200)
        .done(done);
});

it("Get jsonplaceholder photos: jsonTypes", (done) => {
    frisby
        .get("https://jsonplaceholder.typicode.com/photos?id=10")
        .expect("jsonTypes", "*", {
            albumId: Joi.number(),
            id: Joi.number(),
            title: Joi.string(),
            url: Joi.string(),
            thumbnailUrl: Joi.string(),
        })
        .done(done);
});

it("Get jsonplaceholder photos: json", (done) => {
    frisby
        .get("https://jsonplaceholder.typicode.com/photos?id=10")
        .then((response) => {
            // expectJSONLength("*", 5); // 5 fields for each photo
            // .expectJSON("*", {
            //     id: function(val) { expect(val).toBe(10); }, // Custom matcher callback
            // })
        })
        .done(done);
});
