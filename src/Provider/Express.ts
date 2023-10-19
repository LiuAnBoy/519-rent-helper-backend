import express, { Application } from 'express';

import Locals from './Locals';
import Middleware from '../Middleware';
import Routes from './Routes';
import Task from '../Controller/task/cronjob';

class Express {
  public express: Application;

  constructor() {
    this.express = express();

    this.mountMiddlewares();
    this.mountRoutes();
    this.mountSettings();

    // Task.token();
    // Task.fetch();
  }

  private mountSettings(): void {
    this.express = Locals.init(this.express);
  }

  private mountRoutes(): void {
    // Load API routes
    this.express = Routes.mountApi(this.express);
    this.express = Routes.mountAuth(this.express);
    this.express = Routes.mountLine(this.express);
    this.express = Routes.mountLineWebhook(this.express);
  }

  private mountMiddlewares(): void {
    // Mount basic express apis middleware
    this.express = Middleware.init(this.express);
  }

  public init() {
    const port: number = Locals.config().port;

    // // Registering Exception / Error Handlers
    // this.express.use(ExceptionHandler.errorHandler);

    // Server statics assets in production
    if (process.env.NODE_ENV === 'production') {
      // Set static folder
      this.express.use(express.static('client/build'));
    }

    // Start the server on the specified port
    this.express
      .listen(port, () => {
        return console.log(
          '\x1b[33m%s\x1b[0m',
          `Server     :: Running SERVER @ 'http://localhost:${port}'`,
        );
      })
      .on('error', (_error) => {
        return console.log('Error: ', _error.message);
      });
  }
}

export default new Express();
