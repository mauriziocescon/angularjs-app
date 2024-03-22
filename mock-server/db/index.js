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
};

Array.from({length: 100}, (value, index) => mocks.albums.push(album.getAlbum(index)));
Array.from({length: 500}, (value, index) => mocks.comments.push(comment.getComment(index)));
Array.from({length: 5000}, (value, index) => mocks.photos.push(photo.getPhoto(index)));
Array.from({length: 100}, (value, index) => mocks.posts.push(post.getPost(index)));
Array.from({length: 200}, (value, index) => mocks.todos.push(todo.getTodo(index)));
Array.from({length: 10}, (value, index) => mocks.users.push(user.getUser(index)));

exports.mocks = mocks;
