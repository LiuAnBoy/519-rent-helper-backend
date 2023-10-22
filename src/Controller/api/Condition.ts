import { Response, Request } from 'express';
// import axios, { AxiosError } from 'axios';
import moment from 'moment';

import Fetch from '../app/Fetch';
import Condition from '../../Models/condition';
import User, { IUser } from '../../Models/user';

import Format from '../app/Format';

const idxDict: { [key: number]: string } = {
  0: '一',
  1: '二',
  2: '三',
  3: '四',
  4: '五',
};

class ConditionController {
  public static async getAllCondition(req: Request, res: Response) {
    const { uId } = req.params;

    try {
      const conditions = await Condition.find({ user_id: uId }, { __v: 0 });

      const data = conditions
        .map((condition) => Format.conditionToForm(condition))
        .sort(
          (a, b) => moment(a.created_at).unix() - moment(b.created_at).unix(),
        );

      return res.status(200).json({ success: true, data });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal Server Error', data: [] });
    }
  }

  public static async getCondition(req: Request, res: Response) {
    const { cId } = req.params;

    try {
      const condition = await Condition.findById(cId, { __v: 0 }).populate<{
        user: IUser;
      }>('user_id', { __v: 0 });

      if (!condition) {
        return res
          .status(404)
          .send({ success: false, message: '找不到此條件', data: {} });
      }

      const data = Format.conditionToForm(condition);

      return res.status(200).json({ success: true, data });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal Server Error', data: [] });
    }
  }

  public static async createCondition(req: Request, res: Response) {
    const { user } = req.body;

    const data = Format.formToCondition(req.body);

    try {
      const conditions = await Condition.find({ user_id: user._id });

      if (conditions.length >= 3) {
        return res
          .status(400)
          .send({ success: false, message: '條件設定已達上限' });
      }

      const houseId = await Fetch.HouseId(data);

      const newCondition = new Condition({
        ...data,
        name: data.name || `第${idxDict[conditions.length]}組條件`,
        user_id: user._id,
        house_id: houseId,
        created_at: moment().utc().toDate(),
      });

      await newCondition.save();

      delete newCondition.__v;

      await User.findOneAndUpdate(
        { _id: user._id },
        { $inc: { condition: 1 } },
      );

      const res_data = Format.conditionToForm(newCondition);

      return res.status(200).send({
        success: true,
        message: '條件設定成功',
        data: { ...res_data },
      });
    } catch (error) {
      console.log(error);

      return res
        .status(500)
        .json({ success: false, message: 'Internal Server Error' });
    }
  }

  public static async updateCondition(req: Request, res: Response) {
    const { cId } = req.params;

    const data = Format.formToCondition(req.body);

    try {
      const condition = await Condition.findById(cId);

      if (!condition) {
        return res
          .status(404)
          .send({ success: false, message: '找不到此條件' });
      }

      const houseId = await Fetch.HouseId(data);

      data.updated_at = moment().utc().toDate();
      data.house_id = houseId || condition.house_id;

      await condition.updateOne({ ...data });

      return res.status(200).send({
        success: true,
        message: '條件設定已更新',
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal Server Error' });
    }
  }

  public static async changePush(req: Request, res: Response) {
    const { cId } = req.params;

    try {
      const condition = await Condition.findOne(
        {
          _id: cId,
        },
        { __v: 0 },
      );

      if (!condition) {
        return res
          .status(404)
          .json({ success: false, message: '找不到此條件' });
      }

      let house_id: string = '';

      if (!condition.push) {
        house_id = await Fetch.HouseId(condition);
      }

      await condition.updateOne({
        push: !condition.push,
        updated_at: moment().utc().toDate(),
        house_id: house_id || condition.house_id,
      });

      return res.status(200).json({
        success: true,
        message: `推播已${condition.push ? '關閉' : '開啟'}`,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal Server Error' });
    }
  }

  public static async deleteCondition(req: Request, res: Response) {
    const { cId } = req.params;
    const { user } = req.body;

    try {
      const condition = await Condition.findById(cId);

      if (!condition) {
        return res
          .status(404)
          .json({ success: false, message: '找不到此條件' });
      }

      await condition.deleteOne();

      await User.findOneAndUpdate(
        { _id: user._id },
        { $inc: { condition: -1 } },
      );

      return res.status(200).json({ success: true, message: '條件已刪除' });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal Server Error' });
    }
  }
}

export default ConditionController;
