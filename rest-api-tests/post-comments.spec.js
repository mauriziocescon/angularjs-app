/**
 * Take a look at @{Link http://frisbyjs.com/docs/api/}
 */
const frisby = require('frisby');
const Joi = frisby.Joi;

const basicUrl = require('./constants').basicUrl;

it('Get post-comments: status', (done) => {
  frisby
    .get(`${basicUrl}comments?postId=1`)
    .expect('status', 200)
    .done(done);
});

it('Get post-comments: jsonTypes', (done) => {
  frisby
    .get(`${basicUrl}comments?postId=1`)
    .expect('jsonTypes', '*', {
      postId: Joi.number(),
      id: Joi.number(),
      name: Joi.string(),
      email: Joi.string(),
      body: Joi.string(),
    })
    .done(done);
});

it('Get post-comments: json', (done) => {
  frisby
    .get(`${basicUrl}comments?postId=1`)
    .then((response) => {
      response.json.forEach((comment) => {
        expect(Object.keys(comment).length).toBe(5); // 5 fields for each comment
      });

      response.json.forEach((comment) => {
        expect(comment.postId).toBe(1); // id = 1
      });
    })
    .done(done);
});
