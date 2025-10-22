import {getAlbum} from './album.js';
import {getComment} from './comment.js';
import {getPhoto} from './photo.js';
import {getPost} from './post.js';
import {getTodo} from './todo.js';
import {getUser} from './user.js';

// db creation
export const mocks = {
  albums: [],
  comments: [],
  photos: [],
  posts: [],
  todos: [],
  users: [],
};

Array.from({length: 100}, (value, index) => mocks.albums.push(getAlbum(index)));
Array.from({length: 500}, (value, index) => mocks.comments.push(getComment(index)));
Array.from({length: 5000}, (value, index) => mocks.photos.push(getPhoto(index)));
Array.from({length: 100}, (value, index) => mocks.posts.push(getPost(index)));
Array.from({length: 200}, (value, index) => mocks.todos.push(getTodo(index)));
Array.from({length: 10}, (value, index) => mocks.users.push(getUser(index)));
