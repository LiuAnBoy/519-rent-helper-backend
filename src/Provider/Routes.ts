import { Application } from 'express';
import bodyParser from 'body-parser';
import * as line from '@line/bot-sdk';

import Auth from '../Routes/Auth';
import Line from '../Routes/Line';
import ApiRouter from '../Routes/Api';
import Locals from './Locals';
import Webhook from '../Controller/line/webhook';

const config = {
  channelAccessToken: Locals.config().msgChannelAccessToken,
  channelSecret: Locals.config().msgChannelSecret,
};

/* eslint class-methods-use-this: "off" */
class Routes {
  public mountApi(_express: Application): Application {
    console.log('Routes     :: Mount API Routes');
    return _express.use('/api', bodyParser.json(), ApiRouter);
  }

  public mountAuth(_express: Application): Application {
    console.log('Routes     :: Mount Auth Routes');
    return _express.use('/auth', bodyParser.json(), Auth);
  }

  public mountLine(_express: Application): Application {
    console.log('Routes     :: Mount Line Routes');
    return _express.use('/line', bodyParser.json(), Line);
  }

  public mountLineWebhook(_express: Application): Application {
    console.log('Routes     :: Mount Line Webhook Routes');
    return _express.use('/webhook', line.middleware(config), Webhook.send);
  }
}

export default new Routes();
