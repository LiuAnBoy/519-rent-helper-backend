import * as dotenv from 'dotenv';
import { Application } from 'express';

class Locals {
  public static config(): ILocalType {
    dotenv.config({ path: '.env' });

    const port = Number(process.env.PORT) || 8000;
    const url = process.env.APP_URL || 'http://localhost:8000';
    const mongoUrl = process.env.MONGO_URI || '';
    const loginChannelSecret = process.env.LOGIN_CHANNEL_SECRET || '';
    const loginChannelID = process.env.LOGIN_CHANNEL_ID || '';
    const msgChannelSecret = process.env.MSG_CHANNEL_SECRET || '';
    const msgChannelAccessToken = process.env.MSG_CHANNEL_ACCESS_TOKEN || '';

    const rentUrl = process.env.RENT_URL || '';
    const rentApiUrl = process.env.RENT_API_URL || '';

    const notifyChannelID = process.env.NOTIFY_CHANNEL_ID || '';
    const notifyChannelSecret = process.env.NOTIFY_CHANNEL_SECRET || '';

    return {
      port,
      url,
      mongoUrl,
      loginChannelSecret,
      loginChannelID,
      msgChannelSecret,
      msgChannelAccessToken,
      rentUrl,
      rentApiUrl,
      notifyChannelID,
      notifyChannelSecret,
    };
  }

  public static init(_express: Application): Application {
    _express.locals.app = this.config();
    return _express;
  }
}

export default Locals;

export interface ILocalType {
  url: string;
  port: number;
  mongoUrl: string;
  loginChannelSecret: string;
  loginChannelID: string;
  msgChannelSecret: string;
  msgChannelAccessToken: string;
  rentUrl: string;
  rentApiUrl: string;
  notifyChannelID: string;
  notifyChannelSecret: string;
}
