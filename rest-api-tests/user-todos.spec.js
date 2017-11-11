/**
 * Take a look at @{Link http://frisbyjs.com/docs/api/}
 */
const frisby = require("frisby");
const Joi = frisby.Joi;

it("Get jsonplaceholder todos: status", (done) => {
    frisby
        .get("https://jsonplaceholder.typicode.com/todos?userId=10")
        .expect("status", 200)
        .done(done);
});

it("Get jsonplaceholder todos: jsonTypes", (done) => {
    frisby
        .get("https://jsonplaceholder.typicode.com/todos?userId=10")
        .expect("jsonTypes", "*", {
            userId: Joi.number(),
            id: Joi.number(),
            title: Joi.string(),
            completed: Joi.boolean(),
        })
        .done(done);
});

it("Get jsonplaceholder todos: json", (done) => {
    frisby
        .get("https://jsonplaceholder.typicode.com/todos?userId=10")
        .then((response) => {
            response.json.forEach((todo) => {
                expect(Object.keys(todo).length).toBe(4); // 4 fields for each todo
            });
        })
        .done(done);
});
