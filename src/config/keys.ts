import ProductionConfig from "./keys_prod";
import DevelopmentConfig from "./keys_dev";

class Keys {
  static config: any = process.env.NODE_ENV === 'production'
    ? new ProductionConfig()
    : new DevelopmentConfig();
}

export default Keys.config;