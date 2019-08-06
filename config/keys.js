switch (process.env.NODE_ENV) {
  case 'production':
    module.exports = require('./keys_prod');
  case 'test':
    module.exports = require('./keys_test');
  default:
    module.exports = require('./keys_dev');  
}

// if (process.env.NODE_ENV === 'production') {
//   module.exports = require('./keys_prod');
// } else {
//   module.exports = require('./keys_dev');
// }
