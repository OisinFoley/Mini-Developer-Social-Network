import fs from 'fs';

export class ConfigHelper {
  private static loadDockerSecretsFile = () => {
    try {
      let json = JSON.parse(fs.readFileSync('/run/secrets/my_secret', 'utf8'));
      let mongoURI: string = json.MONGO_URI;
      let secretOrKey: string = json.SECRET_OR_KEY;
  
      return {
        mongoURI,
        secretOrKey
      }
      
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.log(`No docker secrets.json file provided
          - if intentional, ensure you have provided env variables`);
        return {};
      } else {
        throw err;
      }
    }
  }
  
  static buildConfig = () => {
    const { MONGO_URI, SECRET_OR_KEY } = process.env;
    if (!MONGO_URI || !SECRET_OR_KEY) {
      console.log(`Either 'MONGO_URI' or 'SECRET_OR_KEY' were not provided.`);
      console.log(`Trying to load from Docker secrets config instead.`);
      
      return ConfigHelper.loadDockerSecretsFile();
    }
    return {
      mongoURI: MONGO_URI,
      secretOrKey: SECRET_OR_KEY
    }
  }
}
