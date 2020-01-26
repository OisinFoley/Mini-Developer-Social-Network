# DevConnector - A Small, Social Network-like app, made using React and NodeJs (MERN Stack)

A SPA, which allows you to create a software developer profile, start threads and add comments to them, to facilitate discussions.

Startup: 

- `npm i` from root directory, and `npm i` again when in the `/client` directory.
- Ensure you have a Mongo instance running locally.
- Run `npm run dev` from the root directory (this will startup both the server and client simultaneously).

Features:

- [NodeJs](https://nodejs.org/en/download/) runtime that uses [ExpressJs](https://www.npmjs.com/package/express) middleware to run a server.
- [Typescript](https://www.typescriptlang.org/) - provides static typing on top of core JavaScript
- [MongoDb](https://www.npmjs.com/package/mongodb) for data storage, combined with Mongoose for data modelling.
- [Passport](https://www.npmjs.com/package/passport) for JWT authentication to protect backend routes

- [React](https://reactjs.org/) and [Jsx](https://reactjs.org/docs/introducing-jsx.html) for frontend templating
- [Atomic structure](https://www.youtube.com/watch?v=q5CB1za0NfA) to make development easier to expand and re-use
- [React-redux](https://redux.js.org/basics/usage-with-react) store for state management
- [SASS](https://sass-lang.com/documentation), along with [BEM](http://getbem.com/naming/) naming and [7-1 architecture](https://sass-guidelin.es/#the-7-1-pattern) ([also here](https://gist.github.com/rveitch/84cea9650092119527bc)) pattern for structuring CSS
- [React-router](https://reacttraining.com/react-router/web/guides/quick-start/example-basic-routing) and verifying JWT issued by backend when accessing routes designated as private in frontend.
- [Jest](https://jestjs.io/docs/en/tutorial-react), [Enzyme](https://airbnb.io/enzyme/docs/guides/jest.html) for frontend testing
- [Mocha](https://mochajs.org/#getting-started), [Chai](https://www.chaijs.com/api/), [Sinon](https://sinonjs.org/releases/v7.4.1/) for backend testing
- Front and backend validation of forms and endpoints
- Originally built using [CreateReactApp](https://github.com/facebook/create-react-app)

Good to know:

- The `/client/src/setupTests` file imports shallow, render, mount (from Enzyme) and React components globally for each test, meaning that we don't have to repeat those import statements in each individual test file.

Requirements:

- Node: tested on 8.4.0 

- NPM: tested on 6.2.0

- [Mongo](https://www.mongodb.com/download-center/community): tested on 4.0.0

- A config file under the directory `./src/config/keys_dev.js`, in the format shown below

- [CreateReactApp](https://www.npmjs.com/package/create-react-app), if you wish to start the server and client concurrently without opening a new browser tab automatically (*See BROWSER=none in the scripts section of the package.json file*)

```
  module.exports = {
    mongoURI: 'mongodb://something:something@something',
    secret: 'someValue'
  };
```