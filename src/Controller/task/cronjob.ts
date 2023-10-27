import cron from 'node-cron';

import Fetch from '../app/Fetch';
import Token from '../app/Token';

class Task {
  public static fetch(): void {
    console.log('Rent       :: Rent Task is Running');

    const task = cron.schedule(
      '30 */10 8-23 * * *',
      async () => {
        await Fetch.Rent();
      },
      {
        scheduled: true,
        timezone: 'Asia/Taipei',
      },
    );

    if (process.env.NODE_ENV === 'production') {
      task.start();
    }
  }

  public static token(): void {
    console.log('Token      :: Token Task is Running');
    const task_pre = cron.schedule('0 59 7 * * *', () => Token.refreshToken(), {
      scheduled: true,
      timezone: 'Asia/Taipei',
    });
    const task = cron.schedule(
      '0 29,59 8-23 * * *',
      () => Token.refreshToken(),
      {
        scheduled: true,
        timezone: 'Asia/Taipei',
      },
    );

    if (process.env.NODE_ENV === 'production') {
      task_pre.start();
      task.start();
    }
  }
}

export default Task;
