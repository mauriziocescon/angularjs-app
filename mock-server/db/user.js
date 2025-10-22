import faker from 'faker';

export const getUser = (id) => ({
  id: id + 1,
  name: faker.name.findName(),
  username: faker.internet.userName(),
  email: faker.internet.email(),
  address: {
    street: faker.address.streetName(),
    suite: faker.address.streetSuffix(),
    city: faker.address.city(),
    zipcode: faker.address.zipCode(),
    geo: {
      lat: faker.address.latitude(),
      lng: faker.address.longitude(),
    },
  },
  phone: faker.phone.phoneNumber(),
  website: faker.internet.url(),
  company: {
    name: faker.company.companyName(),
    catchPhrase: faker.company.catchPhraseDescriptor(),
    bs: faker.company.bsNoun(),
  },
});
