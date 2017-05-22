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

1. REST APIs from [jsonplaceholder](https://jsonplaceholder.typicode.com)

## Progressive web app 

1. The app contains a [manifest.json](https://developers.google.com/web/fundamentals/engage-and-retain/web-app-manifest/) and the entire [service-worker](https://developers.google.com/web/fundamentals/getting-started/primers/service-workers) business in order to cache the app (by default sw is disabled: uncomment ``Main.registerServiceWorker();`` to have it working)

## Analysis tools

1. [TSLint](https://github.com/palantir/tslint)

## Unit-tests (karma + jasmine)

1. The unit-tests are written in typescript using Jasmine. You find all the files searching for *__.spec.ts*
 
2. On the console, run ``npm test`` for execute the tests

3. Tests are run automatically by [Travis CI](https://travis-ci.com/)

## e2e-tests (protractor + jasmine)

1. Run ``npm start`` and when the server is up and running, open another console and run ``npm run protractor``

## Lightweight rest-api tests

1. Take a look at [Frisby](http://frisbyjs.com) and write your own tests inside *rest-api-tests*

2. Run ``npm run frisby`` on the console

## Major future developments 

1. Improvement of some layouts (Users / To-Do / Posts)
