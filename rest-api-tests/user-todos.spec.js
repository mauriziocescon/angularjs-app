/**
 * Take a look at @{Link http://frisbyjs.com/docs/api/}
 */
const frisby = require('frisby');
const Joi = frisby.Joi;

const basicUrl = require('./constants').basicUrl;

it('Get todos: status', (done) => {
  frisby
    .get(`${basicUrl}todos?userId=10`)
    .expect('status', 200)
    .done(done);
});

it('Get todos: jsonTypes', (done) => {
  frisby
    .get(`${basicUrl}todos?userId=10`)
    .expect('jsonTypes', '*', {
      userId: Joi.number(),
      id: Joi.number(),
      title: Joi.string(),
      completed: Joi.boolean(),
    })
    .done(done);
});

it('Get todos: json', (done) => {
  frisby
    .get(`${basicUrl}todos?userId=10`)
    .then((response) => {
      response.json.forEach((todo) => {
        expect(Object.keys(todo).length).toBe(4); // 4 fields for each todo
      });
    })
    .done(done);
});
