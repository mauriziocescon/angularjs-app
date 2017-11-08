/**
 * Take a look at @{Link http://frisbyjs.com/docs/api/}
 */
const frisby = require("frisby");
const Joi = frisby.Joi;

it("Get jsonplaceholder todos", function(done) {
    frisby
        .get("https://jsonplaceholder.typicode.com/users?id=10")
        .expect("status", 200)
        .expect("header", {
            "Content-Type": "application/json; charset=utf-8",
        })
        .expect("jsonTypes", "*", {
            id: Joi.number(),
            name: Joi.string(),
            username: Joi.string(),
            email: Joi.string(),
            address: {
                street: Joi.string(),
                suite: Joi.string(),
                city: Joi.string(),
                zipcode: Joi.string(),
                geo: {
                    lat: Joi.string(),
                    lng: Joi.string(),
                },
            },
            phone: Joi.string(),
            website: Joi.string(),
            company: {
                name: Joi.string(),
                catchPhrase: Joi.string(),
                bs: Joi.string(),
            },
        })
        .then(function(response) {
            // expectJSONLength("*", 8);   // 8 fields for each user
        })
        .done(done);
});
