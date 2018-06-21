const album = require('./album');
const comment = require('./comment');
const photo = require('./photo');
const post = require('./post');
const todo = require('./todo');
const user = require('./user');

// db creation
const mocks = {
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
  mocks.albums.push(album.getAlbum(i));
}

// comments
for (let i = 0; i < numberOfComments; i++) {
  mocks.comments.push(comment.getComment(i));
}

// photos
for (let i = 0; i < numberOfPhotos; i++) {
  mocks.photos.push(photo.getPhoto(i));
}

// posts
for (let i = 0; i < numberOfPosts; i++) {
  mocks.posts.push(post.getPost(i));
}

// todos
for (let i = 0; i < numberOfTodos; i++) {
  mocks.todos.push(todo.getTodo(i));
}

// users
for (let i = 0; i < numberOfUsers; i++) {
  mocks.users.push(user.getUser(i));
}

exports.mocks = mocks;
