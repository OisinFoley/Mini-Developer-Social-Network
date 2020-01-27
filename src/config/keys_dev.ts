import IConfig from "../interfaces/IConfig";

class DevelopmentConfig implements IConfig {
  mongoURI = 'mongodb://oisinfoley:p1nec0ne@ds127894.mlab.com:27894/oisinfoleymongo';
  secret = 'oisinsSecretKey';
};

export default DevelopmentConfig;
