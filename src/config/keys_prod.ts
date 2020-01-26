import IConfig from "../interfaces/IConfig";

class ProductionConfig implements IConfig {
  mongoURI = process.env.MONGO_URI || '';
  secret = process.env.SECRET_OR_KEY || '';
};

export default ProductionConfig;