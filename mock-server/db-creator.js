const fs = require("fs");
const faker = require("faker");

// delete db
if (fs.existsSync("./mock-server/db.json")) {
    console.log("File exists. Deleting now ...");
    fs.unlink("./mock-server/db.json");
}

// db creation
const data = {
    albums: [],
    comments: [],
    photos: [],
    posts: [],
    todos: [],
    users: [],
};

// albums
for (let i = 0; i < 100; i++) {
    data.albums.push({
        userId: parseInt(i / 10) + 1,
        id: i + 1,
        title: faker.lorem.text(),
    });
}

// comments
for (let i = 0; i < 500; i++) {
    data.comments.push({
        postId: parseInt(i / 5) + 1,
        id: i + 1,
        name: faker.lorem.text(),
        email: faker.internet.email(),
        body: faker.lorem.text(),
    });
}

// photos
for (let i = 0; i < 5000; i++) {
    data.photos.push({
        albumId: parseInt(i / 50) + 1,
        id: i + 1,
        title: faker.lorem.text(),
        url: faker.image.imageUrl(),
        thumbnailUrl: faker.image.image(),
    });
}

// posts
for (let i = 0; i < 100; i++) {
    data.posts.push({
        userId: parseInt(i / 10) + 1,
        id: i + 1,
        title: faker.lorem.text(),
        body: faker.lorem.text(),
    });
}

// todos
for (let i = 0; i < 200; i++) {
    data.todos.push({
        userId: parseInt(i / 20) + 1,
        id: i + 1,
        title: faker.lorem.text(),
        completed: faker.random.boolean(),
    });
}

// users
for (let i = 0; i < 10; i++) {
    data.users.push({
        id: i + 1,
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
