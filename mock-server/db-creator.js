const fs = require("fs");
const faker = require("faker");

// delete db
if (fs.existsSync("./mock-server/db.json")) {
  console.log("File exists. Deleting now ...");
  fs.unlink("./mock-server/db.json");
}

// db creation
const data = {users: []};

// users
for (let i = 0; i < faker.random.number(100); i++) {
  data.users.push({
    id: i,
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
}

// save file
fs.writeFile("mock-server/db.json", JSON.stringify(data, null, 2), (err) => {
  if (err) {
    throw err;
  }
  console.log("Json db created");
});
