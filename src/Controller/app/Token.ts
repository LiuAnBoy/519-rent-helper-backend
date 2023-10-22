import axios, { AxiosError } from 'axios';
import { Request, Response } from 'express';
import fs from 'fs-extra';
import { messagingApi } from '@line/bot-sdk';

import Locals from '../../Provider/Locals';

class Token {
  public static async getToken(req: Request, res: Response) {
    console.log('Token      :: Start Fetch 591 Token');
    try {
      const r = await axios.get(Locals.config().rentUrl);

      // Get csrf token from 591 web
      const patten = '<meta name="csrf-token" content="([A-Za-z0-9]*)">';
      const regExp = new RegExp(patten, 'gi');
      const token = regExp.exec(r.data);

      let csrfToken;
      if (token) {
        csrfToken = token[1];
      }

      const desiredCookies = ['591_new_session'];
      // Get cookie from 591 web response
      let cookie;

      if (r.headers['set-cookie']) {
        const filteredCookies = r.headers['set-cookie'].filter((c) =>
          desiredCookies.some((desired) => c.includes(desired)),
        );
        cookie = `${filteredCookies.join(';').split(';')[0]};`;
      }

      const tokenObj = {
        csrfToken,
        cookie,
      };

      await fs.writeJSON('./token.json', tokenObj);
      console.log('Token      :: 591 Token Fetch Success');
      return res.status(200).send({ success: true, data: tokenObj });
    } catch (error) {
      const err = error as AxiosError;
      console.log(err);
    }
  }

  public static async refreshToken(replyToken?: string) {
    await axios.get(`${Locals.config().url}/api/fetch/token`);

    if (!replyToken) return;
    const client = new messagingApi.MessagingApiClient({
      channelAccessToken: Locals.config().msgChannelAccessToken,
    });

    return client.replyMessage({
      replyToken: replyToken as string,
      messages: [
        {
          type: 'text',
          text: '已更新憑證。',
        },
      ],
    });
  }
}

export default Token;
