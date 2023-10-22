import { Request, Response } from 'express';
import queryString from 'query-string';
import axios from 'axios';
import * as URL from 'url';

import User from '../../Models/user';
import Locals from '../../Provider/Locals';

class NotifyController {
  public static async CombineNotify(req: Request, res: Response) {
    const { id, code, state } = req.query;

    const redirect_uri = URL.format({
      protocol: process.env.NODE_ENV === 'production' ? 'https' : 'http',
      host: req.headers.host,
      pathname: '/line/notify/token',
    });

    try {
      if (!code) {
        const url = queryString.stringifyUrl({
          url: 'https://notify-bot.line.me/oauth/authorize',
          query: {
            response_type: 'code',
            client_id: Locals.config().notifyChannelID,
            redirect_uri,
            scope: 'notify',
            state: id as string,
          },
        });

        return res.status(200).redirect(url);
      }

      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };

      const url = 'https://notify-bot.line.me/oauth/token';

      const data = {
        code,
        grant_type: 'authorization_code',
        redirect_uri,
        client_id: Locals.config().notifyChannelID,
        client_secret: Locals.config().notifyChannelSecret,
      };

      const response = await axios.post(url, data, config);

      if (response.data.status !== 200) {
        return res
          .status(response.data.status)
          .send({ message: response.data.message });
      }

      await User.findOneAndUpdate(
        { line_id: state },
        { notify_token: response.data.access_token },
      );

      return res.redirect('/');
    } catch (error) {
      console.log(error);
    }
  }

  public static async Push(house: IHouse) {
    const name = `條件名稱：${house.name}`;
    const title = `名稱： ${house.title}`;
    const kindName = `類型： ${house.kind_name}`;
    const price = `租金： ${house.price}元`;
    const section = `地區： ${house.section}`;
    const area = `坪數： ${house.area}`;
    const floor = `樓層： ${house.floor}`;
    const url = `https://rent.591.com.tw/home/${house.pId}`;

    const qs = queryString.stringifyUrl({
      url: 'https://notify-api.line.me/api/notify',
      query: {
        message: `\n\n${name}\n${title}\n${area}\n${kindName}\n${price}\n${floor}\n${section}\n${url}`,
      },
    });

    try {
      await axios.post(
        qs,
        {},
        {
          headers: {
            Authorization: `Bearer ${house.notify_token}`,
          },
        },
      );

      await User.findOneAndUpdate(
        { _id: house.user_id },
        { $inc: { notify_count: 1 } },
      );
      console.log(`Rent       :: ${house.name} Push Notify Finish`);
    } catch (error) {
      if (error instanceof Error) {
        console.log(Error);
      }
      console.log(error);
    }
  }
}

export default NotifyController;

export interface IHouse {
  user_id: string; // 使用者id
  name: string; // 使用者名稱
  title: string; // 物件名稱
  pId: number; // 物件Post id
  section: string; // 物件地區
  area: string; // 物件坪數
  kind_name: string; // 物件類型
  price: string; // 物件租金
  floor: string; // 物件樓層
  notify_token: string; // Notify token
}
