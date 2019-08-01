# DevConnector - A Small, Social Network-like app, made using React and NodeJs (MERN Stack)

A SPA, which allows you to create a software developer profile, start threads and add comments to them, to facilitate discussions.

Features:

- [NodeJs](https://nodejs.org/en/download/) runtime that uses [ExpressJs](https://www.npmjs.com/package/express) middleware to run a server.
- [MongoDb](https://www.npmjs.com/package/mongodb) for data storage, combined with Mongoose for data modelling.
- [Passport](https://www.npmjs.com/package/passport) for JWT authentication to protect backend routes

- [React](https://reactjs.org/) and [Jsx](https://reactjs.org/docs/introducing-jsx.html) for frontend templating
- [Atomic structure](https://www.youtube.com/watch?v=q5CB1za0NfA) to make development easier to expand and re-use
- [React-redux](https://redux.js.org/basics/usage-with-react) store for state management
- [SASS](https://sass-lang.com/documentation), along with [BEM](http://getbem.com/naming/) naming and [7-1 architecture](https://sass-guidelin.es/#the-7-1-pattern) ([also here](https://gist.github.com/rveitch/84cea9650092119527bc)) pattern for structuring CSS
- [React-router](https://reacttraining.com/react-router/web/guides/quick-start/example-basic-routing) and verifying JWT issued by backend when accessing routes designated as private in frontend.
- [Jest](https://jestjs.io/docs/en/tutorial-react), [Enzyme](https://airbnb.io/enzyme/docs/guides/jest.html) for frontend testing

- Front and backend validation of forms and endpoints
- Originally built using [CreateReactApp](https://github.com/facebook/create-react-app)

Requirements:

- Node: tested on 8.4.0 

- NPM: tested on 6.2.0

- [Mongo](https://www.mongodb.com/download-center/community): tested on 4.0.0

- A connection string - in ```config/keys_dev.js``` - in the following format

```
  module.exports = {
    mongoURI: 'mongodb://something:something@something',
    secret: 'someValue'
  };
```