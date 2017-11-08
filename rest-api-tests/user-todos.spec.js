/**
 * Take a look at @{Link http://frisbyjs.com/docs/api/}
 */
const frisby = require("frisby");
const Joi = frisby.Joi;

it("Get jsonplaceholder todos", function(done) {
    frisby
        .get("https://jsonplaceholder.typicode.com/todos")
        .expect("status", 200)
        .expect("header", {
            "Content-Type": "application/json; charset=utf-8",
        })
        .expect("jsonTypes", "*", {
            userId: Joi.number(),
            id: Joi.number(),
            title: Joi.string(),
            completed: Joi.boolean(),
        })
        .then(function(response) {
            // expectJSONLength("*", 4);   // 4 fields for each todo
        })
        .done(done);
});
