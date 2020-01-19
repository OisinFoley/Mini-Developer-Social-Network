// if (process.env.NODE_ENV === 'production') {
//   export const mongoUri = require('./keys_prod');
// } else {
//   export const mongoUri = require('./keys_dev');
// }

// issue is that using require leaves the object deeply nested, but using import returns an empty object

let uri = process.env.NODE_ENV === 'production'
  ? require('./keys_prod')
  : require('./keys_dev');

export const mongoUri =
  process.env.NODE_ENV === 'production'
  ? require('./keys_prod').default
  : require('./keys_dev').default;