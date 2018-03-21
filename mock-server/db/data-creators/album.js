const faker = require("faker");

exports.getAlbum = (id) => {
    return {
        userId: parseInt(id / 10) + 1,
        id: id + 1,
        title: faker.lorem.text(),
    };
};
