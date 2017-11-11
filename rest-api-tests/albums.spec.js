/**
 * Take a look at @{Link http://frisbyjs.com/docs/api/}
 */
const frisby = require("frisby");
const Joi = frisby.Joi;

it("Get jsonplaceholder albums: status", (done) => {
    frisby
        .get("https://jsonplaceholder.typicode.com/albums?_page=1")
        .expect("status", 200)
        .done(done);
});

it("Get jsonplaceholder albums: jsonTypes", (done) => {
    frisby
        .get("https://jsonplaceholder.typicode.com/albums?_page=1")
        .expect("jsonTypes", "*", {
            userId: Joi.number(),
            id: Joi.number(),
            title: Joi.string(),
        })
        .done(done);
});

it("Get jsonplaceholder albums: json", (done) => {
    frisby
        .get("https://jsonplaceholder.typicode.com/albums?_page=1")
        .then((response) => {
            expect(response.json.length).toBe(10); // 10 photos for each page
            // expectJSONLength("*", 3);   // 3 fields for each album
        })
        .done(done);
});
