import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../Models/user';

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token)
      return res.status(401).send({ success: false, message: '無效的憑證' });

    const decoded = jwt.decode(token) as LineProfile;

    const user = await User.findOne({ line_id: decoded.sub }, { __v: 0 });

    if (!user)
      return res.status(403).send({ success: false, message: '查無此使用者' });

    const userData = {
      ...user?.toObject(),
      exp: decoded.exp,
      iat: decoded.iat,
    };

    req.body.user = userData;
    req.body.token = token;

    return next();
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: 'Internal Server Error' });
  }
};

export default auth;

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
