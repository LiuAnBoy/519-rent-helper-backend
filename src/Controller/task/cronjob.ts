import cron from 'node-cron';

import Fetch from '../app/Fetch';
import Token from '../app/Token';

class Task {
  public static fetch(): void {
    console.log('Rent       :: Rent Task is Running');

    cron.schedule(
      '30 */15 8-23 * * *',
      async () => {
        await Fetch.Rent();
      },
      {
        scheduled: true,
        timezone: 'Asia/Taipei',
      },
    );
  }

  public static token(): void {
    console.log('Token      :: Token Task is Running');
    cron.schedule('0 59 7 * * *', () => Token.refreshToken(), {
      scheduled: true,
      timezone: 'Asia/Taipei',
    });
    cron.schedule('0 0,30 8-23 * * *', () => Token.refreshToken(), {
      scheduled: true,
      timezone: 'Asia/Taipei',
    });
  }
}

export default Task;
