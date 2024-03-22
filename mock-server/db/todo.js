const faker = require('faker');

exports.getTodo = (id) => ({
  userId: parseInt(id / 20) + 1,
  id: id + 1,
  title: faker.lorem.text(),
  completed: faker.datatype.boolean(),
});
