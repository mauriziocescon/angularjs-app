import faker from 'faker';

export const getComment = (id) => ({
  postId: parseInt(id / 5) + 1,
  id: id + 1,
  name: faker.lorem.text(),
  email: faker.internet.email(),
  body: faker.lorem.text(),
});
