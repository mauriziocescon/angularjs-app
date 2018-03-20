const dataCreator = require("./data-creator");
const utils = require("./db-utils");
const dbUrl = require("./constants").dbUrl;

function main() {
    utils.deleteDb(dbUrl, (err) => {
        if (err) {
            throw err;
        }

        // db creation
        const data = {
            albums: [],
            comments: [],
            photos: [],
            posts: [],
            todos: [],
            users: [],
            logs: [],
        };

        // do items
        const numberOfAlbums = 100;
        const numberOfComments = 500;
        const numberOfPhotos = 5000;
        const numberOfPosts = 100;
        const numberOfTodos = 200;
        const numberOfUsers = 10;

        // albums
        for (let i = 0; i < numberOfAlbums; i++) {
            data.albums.push(dataCreator.getAlbum(i));
        }

        // comments
        for (let i = 0; i < numberOfComments; i++) {
            data.comments.push(dataCreator.getComment(i));
        }

        // photos
        for (let i = 0; i < numberOfPhotos; i++) {
            data.photos.push(dataCreator.getPhoto(i));
        }

        // posts
        for (let i = 0; i < numberOfPosts; i++) {
            data.posts.push(dataCreator.getPost(i));
        }

        // todos
        for (let i = 0; i < numberOfTodos; i++) {
            data.todos.push(dataCreator.getTodo(i));
        }

        // users
        for (let i = 0; i < numberOfUsers; i++) {
            data.users.push(dataCreator.getUser(i));
        }

        utils.saveDb(dbUrl, data, (err) => {
            if (err) {
                throw err;
            }
            console.log('Json db created');
        });
    });
}

main();
