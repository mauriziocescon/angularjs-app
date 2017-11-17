Demo built on angular 1.x, Typescript, ES2017, ui-router
=========

## How to build the app

1. Before starting, take a look at the following [page](http://www.typescriptlang.org/docs/handbook/gulp.html); it's also noteworthy [The Future of Declaration Files](https://blogs.msdn.microsoft.com/typescript/2016/06/15/the-future-of-declaration-files/)

2. Download and install [NodeJS](https://nodejs.org/en/)

3. From the console, run ``npm install``

4. On the console, run ``npm run build`` in order to build the code inside *dist* 

5. On the console, run ``npm run serve`` in order to launch the application 

6. If you want to mock the backend, run ``npm run serve-mock`` or ``npm run build-mock``
   
## Backend implementation 

1. REST APIs from [JSONPlaceholder](https://jsonplaceholder.typicode.com)

## Progressive web app 

Definition of mock responses using [json-server](https://github.com/typicode/json-server) and [faker](https://github.com/Marak/faker.js) (APIs available at `http://localhost:5000/api/`)

## Libs & Tooling

1. [Angular 1.x](https://angularjs.org/) 

2. [Typescript](https://www.typescriptlang.org/) (with ``--strict true``) 

3. [Bootstrap 3.x](http://getbootstrap.com/) 

4. [UI-Router](https://ui-router.github.io/) 

5. [Sass](http://sass-lang.com/) 

7. [Webpack](https://webpack.js.org/) 

8. [Babel](https://babeljs.io/)

10. [TSLint](https://palantir.github.io/tslint/) 

11. [Stylelint](https://stylelint.io/) 

12. [JSON Server](https://github.com/typicode/json-server) 

## Unit-tests (karma + jasmine)

1. The unit-tests are written in typescript using Jasmine. You find all the files searching for *__.spec.ts*
 
2. On the console, run ``npm test`` for executing them 

3. Tests are also executed automatically by [Travis CI](https://travis-ci.com/)

## e2e-tests (protractor + jasmine)

1. Run ``npm start`` and when the server is up and running, open another console and run ``npm run protractor``

## Lightweight rest-api tests

1. Run ``npm run test-api`` in order to execute tests inside *rest-api-tests* with [Frisby](http://frisbyjs.com)

## Major future improvements 

1. Layouts Users / To-Do / Posts
