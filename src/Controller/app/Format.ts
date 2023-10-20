import queryString from 'query-string';
import { Request, Response } from 'express';
import fs from 'fs-extra';
import axios from 'axios';

import Condition, { ICondition, ConditionProps } from '../../Models/condition';
import Price from '../../Utils/Price';
import MultiArea from '../../Utils/MultiArea';
import Locals from '../../Provider/Locals';
import { RentUrlProps } from './Fetch';
import { IUser } from '../../Models/user';

class Format {
  public static formToCondition(formData: FormConditionProps) {
    const data: Partial<ConditionProps> = {};

    if (formData.name) data.name = formData.name;
    if (formData.push) data.push = formData.push;
    if (formData.floor) data.floor = formData.floor;
    if (formData.region) data.region = formData.region;
    if (formData.section)
      data.section =
        formData.section.length > 0 ? formData.section.join(',') : '';
    if (formData.kind) data.kind = formData.kind;
    if (formData.price)
      data.price =
        formData.price.length === 0 &&
        (formData.min_price || formData.max_price)
          ? `${formData.min_price}_${formData.max_price}`
          : formData.price.join(',');
    if (formData.multiRoom) data.multiRoom = formData.multiRoom.join(',');
    if (formData.other) data.other = formData.other.join(',');
    if (formData.shape)
      data.shape = formData.shape.length > 0 ? formData.shape.join(',') : '';
    if (formData.multiArea)
      data.multiArea =
        formData.multiArea.length === 0 &&
        (formData.min_area || formData.max_area)
          ? `${formData.min_area}_${formData.max_area}`
          : formData.multiArea.join(',');
    if (formData.option) data.option = formData.option.join(',');
    if (formData.multiNotice) data.multiNotice = formData.multiNotice.join(',');

    return data;
  }

  /* eslint @typescript-eslint/no-explicit-any: 0 */
  public static conditionToForm(condition: ICondition) {
    const handleSplitValue = (value: string, dict: any) => {
      if (value.includes(',')) {
        const val = value.split(',');
        return val;
      }

      if (dict[value]) {
        return [value];
      }

      return [];
    };

    const handleSplitSmallValue = (value: string, dict: any) => {
      const val = value.split(',');
      if (value.includes(',') || !value || dict[val[0]]) return ['', ''];
      return value.split('_');
    };

    const data: FormConditionProps = {
      ...condition.toObject(),
      section: condition.section.length > 1 ? condition.section.split(',') : [],
      price: handleSplitValue(condition.price, Price),
      max_price: handleSplitSmallValue(condition.price, Price)[1],
      min_price: handleSplitSmallValue(condition.price, Price)[0],
      multiRoom:
        condition.multiRoom.length > 1 ? condition.multiRoom.split(',') : [],
      other: condition.other.length > 1 ? condition.other.split(',') : [],
      shape: condition.shape.length > 1 ? condition.shape.split(',') : [],
      multiArea: handleSplitValue(condition.multiArea, MultiArea),
      max_area: handleSplitSmallValue(condition.multiArea, MultiArea)[1],
      min_area: handleSplitSmallValue(condition.multiArea, MultiArea)[0],
      option: condition.option.length > 1 ? condition.option.split(',') : [],
      multiNotice:
        condition.multiNotice.length > 1
          ? condition.multiNotice.split(',')
          : [],
    };
    if (condition.user_id) {
      data.user = condition.user_id as IUser;
      delete data.user_id;
    }

    return data;
  }

  public static conditionToUrl(condition: ConditionProps) {
    const query: Partial<RentUrlProps> = {};

    if (condition.region) query.region = condition.region;
    if (condition.section) query.section = condition.section;
    if (condition.kind) query.kind = condition.kind;
    if (condition.shape) query.shape = condition.shape;
    if (condition.floor) query.floor = condition.floor;
    if (condition.price) query.price = condition.price;
    if (condition.multiArea) query.multiArea = condition.multiArea;
    if (condition.multiRoom) query.multiRoom = condition.multiRoom;
    if (condition.option) query.option = condition.option;
    if (condition.other) query.other = condition.other;
    if (condition.multiNotice) query.multiNotice = condition.multiNotice;
    const baseUrl = Locals.config().rentApiUrl;
    const url = queryString.stringifyUrl({
      url: baseUrl,
      query: {
        ...query,
        orderType: 'desc',
      },
    });

    return url;
  }

  public static async formatUrl(req: Request, res: Response) {
    const { cId } = req.params;

    try {
      const condition = await Condition.findById(cId);
      if (!condition) {
        return res.status(404).send({
          success: false,
          message: '找不到此條件',
        });
      }

      const url = Format.conditionToUrl(condition);

      const headers = {
        'X-CSRF-TOKEN': '',
        Cookie: '',
      };

      const readData = await fs.readJson('./token.json');
      headers['X-CSRF-TOKEN'] = readData.csrfToken;
      headers.Cookie = `${readData.cookie}urlJumpIp=${condition.region};`;
      const rentData = await axios.get(url, { headers });

      return res.status(200).send({
        success: true,
        message: {
          url,
          isMatch:
            condition.house_id === String(rentData.data.data.data[0].post_id),
          house_id: condition.house_id,
          data: rentData.data.data.data,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export default Format;

export interface FormConditionProps {
  _id: string;
  name: string;
  push: boolean;
  house_id: string;
  user_id?: string | IUser;
  floor: string;
  shape: string[];
  kind: string;
  multiArea: string[];
  multiNotice: string[];
  multiRoom: string[];
  option: string[];
  other: string[];
  region: string;
  section: string[];
  price: string[];
  max_price: string;
  min_price: string;
  max_area: string;
  min_area: string;
  created_at: Date;
  updated_at: Date;
  user?: IUser;
}
