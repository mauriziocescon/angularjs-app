const faker = require('faker');

exports.getPost = (id) => ({
  userId: parseInt(id / 10) + 1,
  id: id + 1,
  title: faker.lorem.text(),
  body: faker.lorem.text(),
});
