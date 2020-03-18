import { Config } from "devconnector-types/interfaces";

class ProductionConfig implements Config {
  mongoURI = process.env.MONGO_URI || '';
  secret = process.env.SECRET_OR_KEY || '';
};

export default ProductionConfig;