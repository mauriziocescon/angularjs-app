import faker from 'faker';

export const getAlbum = (id) => ({
  userId: parseInt(id / 10) + 1,
  id: id + 1,
  title: faker.lorem.text(),
});
