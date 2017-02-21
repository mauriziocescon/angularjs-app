Demo built on angular 1.x, Typescript, ES2017, ui-router
=========

## How to compile the app

1. Before starting, take a look at the following [post](http://www.typescriptlang.org/docs/handbook/gulp.html) from the typescript developer team; it's also noteworthy [The Future of Declaration Files](https://blogs.msdn.microsoft.com/typescript/2016/06/15/the-future-of-declaration-files/)

2. Download and install [NodeJS](https://nodejs.org/en/)

3. Download [Webstorm](https://www.jetbrains.com/webstorm/) or open your favourite IDE

4. From the console, run ``npm install``. You'll get a folder named *node_modules* with all necessary modules

5. Run ``npm run dev`` or ``npm run prod`` on the console in order to deploy the code inside *dist* 

6. If you want to mock the backend, run ``npm run dev-mock`` or ``npm run prod-mock``

7. Using ``npm run dev`` or ``npm run dev-mock``, you get incremental buildings of typescript code (thanks to [watchify](https://www.npmjs.com/package/watchify)) and live update on multiple browsers (thanks to [browsersync](https://browsersync.io))
   
## Backend implementation 

1. REST APIs from [jsonplaceholder](https://jsonplaceholder.typicode.com)

## Progressive web app 

1. The app contains a [manifest.json](https://developers.google.com/web/fundamentals/engage-and-retain/web-app-manifest/) and the entire [service-worker](https://developers.google.com/web/fundamentals/getting-started/primers/service-workers) business in order to cache the app (by default sw is disabled: uncomment ``Main.registerServiceWorker();`` to have it working)

## Unit-tests (karma + jasmine)

1. The unit-tests are written in typescript using Jasmine. You fine all the files searching for *__.spec.ts*
 
2. On the console, run ``npm test`` for execute the tests

## e2e-tests (protractor + jasmine)

1. Run ``npm start`` and when the server is up and running, open another console and run ``npm run protractor``

## Lightweight rest-api tests

1. Take a look at [Frisby](http://frisbyjs.com) and write your own tests inside *rest-api-tests*

2. Run ``npm run frisby`` on the console

## Updating Node modules

1. Check versions using ``npm outdated``

2. Update ``package.json`` modules using ``npm update``

## Major future developments 

1. Soon: improve some layouts (Users / To-Do / Posts) and readme.md

2. Angular 2 + Webpack 

3. More e2e tests written in Typescript

4. Convert serviceworker to Typescript