import { Config } from "devconnector-types/interfaces";

class DevelopmentConfig implements Config {
  mongoURI = 'mongodb://oisinfoley:p1nec0ne@ds127894.mlab.com:27894/oisinfoleymongo';
  secret = 'oisinsSecretKey';
};

export default DevelopmentConfig;
