const faker = require("faker");

exports.getAlbum = function(id) {
    return {
        userId: parseInt(id / 10) + 1,
        id: id + 1,
        title: faker.lorem.text(),
    };
};

exports.getComment = function(id) {
    return {
        postId: parseInt(id / 5) + 1,
        id: id + 1,
        name: faker.lorem.text(),
        email: faker.internet.email(),
        body: faker.lorem.text(),
    };
};

exports.getPhoto = function(id) {
    return {
        albumId: parseInt(id / 50) + 1,
        id: id + 1,
        title: faker.lorem.text(),
        url: faker.image.imageUrl(),
        thumbnailUrl: faker.image.imageUrl(250, 250),
    };
};

exports.getPost = function(id) {
    return {
        userId: parseInt(id / 10) + 1,
        id: id + 1,
        title: faker.lorem.text(),
        body: faker.lorem.text(),
    };
};

exports.getTodo = function(id) {
    return {
        userId: parseInt(id / 20) + 1,
        id: id + 1,
        title: faker.lorem.text(),
        completed: faker.random.boolean(),
    };
};

exports.getUser = function(id) {
    return {
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
    };
};
