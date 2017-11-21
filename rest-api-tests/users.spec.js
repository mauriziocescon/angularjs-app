/**
 * Take a look at @{Link http://frisbyjs.com/docs/api/}
 */
const frisby = require("frisby");
const Joi = frisby.Joi;

it("Get jsonplaceholder users: status", (done) => {
    frisby
        .get("http://localhost:5000/users?id=10")
        .expect("status", 200)
        .done(done);
});

it("Get jsonplaceholder users: jsonTypes", (done) => {
    frisby
        .get("http://localhost:5000/users?id=10")
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
        .done(done);
});

it("Get jsonplaceholder users: json", (done) => {
    frisby
        .get("http://localhost:5000/users?id=10")
        .then((response) => {
            response.json.forEach((user) => {
                expect(Object.keys(user).length).toBe(8); // 8 fields for each user
            });
        })
        .done(done);
});
