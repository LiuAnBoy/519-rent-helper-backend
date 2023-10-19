import * as line from '@line/bot-sdk';
import axios from 'axios';
import { Request, Response } from 'express';
import Locals from '../../Provider/Locals';
import Token from '../app/Token';

class Webhook {
  public static async send(req: Request, res: Response) {
    const client = new line.messagingApi.MessagingApiClient({
      channelAccessToken: Locals.config().msgChannelAccessToken,
    });

    const events: line.WebhookEvent[] = req.body.events;

    const results = await axios.all(
      events.map(async (event: line.WebhookEvent) => {
        try {
          if (event.type !== 'message' || event.message.type !== 'text') {
            if (event.type === 'follow') {
              const { userId } = event.source;
              const { replyToken } = event;
              const { displayName } = await client.getProfile(userId as string);

              return client.replyMessage({
                replyToken: replyToken as string,
                messages: [
                  {
                    type: 'text',
                    text: `您好，${displayName}，歡迎使用租屋小幫手！\n\n請輸入「更新憑證」來更新您的憑證。`,
                  },
                ],
              });
            }
            return;
          }

          // Process all message related variables here.
          const { replyToken } = event;
          const { text } = event.message;
          const { userId } = event.source;

          switch (true) {
            case text === '更新憑證':
              Token.refreshToken(replyToken as string);
              break;
            default:
              console.log(event);
              return await client.replyMessage({
                replyToken: replyToken as string,
                messages: [
                  {
                    type: 'text',
                    text: '安安你好。',
                  },
                ],
              });
          }
        } catch (error) {
          if (error instanceof Error) {
            console.log(error);
          }

          return res.status(500).json({
            status: 'error',
          });
        }
      }),
    );

    return res.status(200).json({
      status: 'success',
      results,
    });
  }
}

export default Webhook;
