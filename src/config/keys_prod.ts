import { Config } from "devconnector-types/interfaces";
import { ConfigHelper } from './config-helper';

class ProductionConfig implements Config {
  mongoURI = '';
  secret = '';

  constructor() {
    let config = ConfigHelper.buildConfig();

    this.mongoURI = config.mongoURI || ''
    this.secret = config.secretOrKey || '';
  }
};

export default ProductionConfig;