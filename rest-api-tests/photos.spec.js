/**
 * Take a look at @{Link http://frisbyjs.com/docs/api/}
 */
const frisby = require("frisby");
const Joi = frisby.Joi;

it("Get  photos: status", (done) => {
    frisby
        .get("http://localhost:5000/photos?id=10")
        .expect("status", 200)
        .done(done);
});

it("Get photos: jsonTypes", (done) => {
    frisby
        .get("http://localhost:5000/photos?id=10")
        .expect("jsonTypes", "*", {
            albumId: Joi.number(),
            id: Joi.number(),
            title: Joi.string(),
            url: Joi.string(),
            thumbnailUrl: Joi.string(),
        })
        .done(done);
});

it("Get photos: json", (done) => {
    frisby
        .get("http://localhost:5000/photos?id=10")
        .then((response) => {
            response.json.forEach((photo) => {
                expect(Object.keys(photo).length).toBe(5); // 5 fields for each photo
            });

            response.json.forEach((photo) => {
                expect(photo.id).toBe(10); // id = 10
            });
        })
        .done(done);
});
