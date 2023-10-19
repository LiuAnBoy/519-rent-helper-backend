import axios from 'axios';
import { Request, Response } from 'express';
import queryString from 'query-string';
import jwt from 'jsonwebtoken';
import * as uuid from 'uuid';
import * as URL from 'url';

import User from '../../Models/user';
import Locals from '../../Provider/Locals';

class AuthController {
  public static async Login(req: Request, res: Response) {
    const { code } = req.query;

    const redirect_uri = URL.format({
      protocol: process.env.NODE_ENV === 'production' ? 'https' : 'http',
      host: req.headers.host,
      pathname: '/auth/login',
    });

    if (!code) {
      // LIFF AUTHORIZE
      const url = queryString.stringifyUrl({
        url: 'https://access.line.me/oauth2/v2.1/authorize',
        query: {
          response_type: 'code',
          client_id: Locals.config().loginChannelID,
          redirect_uri,
          state: uuid.v4(),
          scope: 'openid profile email',
        },
      });
      return res.redirect(url);
    }

    // LIFF GET TOKEN
    const tokenUrl = 'https://api.line.me/oauth2/v2.1/token';

    const tokenData = {
      grant_type: 'authorization_code',
      code,
      redirect_uri,
      client_id: Locals.config().loginChannelID,
      client_secret: Locals.config().loginChannelSecret,
    };

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    try {
      const tokenResponse = await axios.post<LineToken>(
        tokenUrl,
        tokenData,
        config,
      );

      const profile = jwt.decode(tokenResponse.data.id_token) as LineProfile;

      const user = await User.findOne({ line_id: profile.sub });

      if (!user) {
        const newUser = new User({
          name: profile.name,
          email: profile.email,
          picture: profile.picture,
          line_id: profile.sub,
        });

        await newUser.save();
      }

      return res.redirect(`/?token=${tokenResponse.data.id_token}`);
    } catch (error) {
      console.log(error);
    }
  }

  public static async liffLogin(req: Request, res: Response) {
    const { code } = req.body;
    const profile = jwt.decode(code) as LineProfile;
    try {
      const user = await User.findOne({ line_id: profile.sub });

      if (!user) {
        const newUser = new User({
          name: profile.name,
          email: profile.email,
          picture: profile.picture,
          line_id: profile.sub,
        });

        await newUser.save();

        return res.status(200).send({
          success: true,
          message: '登入成功',
          data: { ...newUser.toObject() },
        });
      }

      return res.status(200).send({
        success: true,
        message: '登入成功',
        data: { ...user.toObject() },
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export default AuthController;

interface LineToken {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
}

interface LineProfile {
  sub: string;
  name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  nonce: string;
}
