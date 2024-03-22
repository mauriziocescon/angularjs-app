const faker = require('faker');

exports.getPhoto = (id) => ({
  albumId: parseInt(id / 50) + 1,
  id: id + 1,
  title: faker.lorem.text(),
  url: faker.image.imageUrl(),
  thumbnailUrl: faker.image.imageUrl(250, 250),
});
