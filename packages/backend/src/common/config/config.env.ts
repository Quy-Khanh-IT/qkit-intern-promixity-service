import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const dev = {
  PROXY: process.env.PROXY,
  DB: {
    HOST: process.env.MONGO_HOST,
    PORT: process.env.MONGO_PORT,
    NAME: process.env.MONGO_NAME,
    USER: process.env.MONGO_USER_NAME,
    PASSWORD: process.env.MONGO_PASSWORD,
    URI: `mongodb://${process.env.DB_PORT}:${process.env.DB_PORT}/${process.env.MONGO_NAME}`,
  },
};

const pro = {
  PROXY: process.env.PROXY,
};

const config = { dev, pro };

const env = process.env.NODE_ENV || 'dev';

export default config[env];
