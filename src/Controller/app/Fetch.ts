import fs from 'fs-extra';
import axios from 'axios';
import moment from 'moment';
import { Request, Response } from 'express';

import Notify, { NotifyPushProps } from '../line/notify';
import Condition, { ConditionProps, ICondition } from '../../Models/condition';
import Locals from '../../Provider/Locals';
import { IUser } from '../../Models/user';
import Format from './Format';

class Fetch {
  public static async Rent() {
    console.log('Rent       :: ----- Start fetch Rent data -----');
    console.log(
      `Rent       :: -----  ${moment().format('YYYY-MM-DD hh:mm:ss')}  -----`,
    );

    try {
      const conditions = await Condition.find({
        push: true,
      }).populate<{ user: IUser }>('user_id');

      axios
        .all(
          conditions.map(async (condition: ICondition) => {
            const url = Format.conditionToUrl(condition);
            const headers = await Format.Headers(condition.region);

            const rentData = await axios.get(url, { headers });
            return { condition, rentData };
          }),
        )
        .then(
          axios.spread(async (...responses) => {
            const notifyPromises = responses.map(async (response, index) => {
              console.log(
                `Rent       :: ${index + 1}. ${
                  response.condition.name
                } Fetch Rent Data Start`,
              );

              const data = response.rentData.data.data.data;

              if (response.condition.house_id === data[0].post_id) {
                return console.log(
                  `Rent       :: ${index + 1}. ${
                    response.condition.name
                  } No New House`,
                );
              }

              /* eslint @typescript-eslint/no-explicit-any: 0 */
              const existConditionIdx = data.findIndex(
                (d: any) => d.post_id === response.condition.house_id,
              );

              /* eslint no-await-in-loop: 0 */
              const user = response.condition.user_id as IUser;
              for (let i = 0; i < existConditionIdx; i += 1) {
                const house: NotifyPushProps = {
                  user_id: user._id,
                  name: response.condition.name,
                  title: data[i].title,
                  pId: data[i].post_id,
                  section: data[i].section_name,
                  area: data[i].area,
                  price: data[i].price,
                  kind_name: data[i].kind_name,
                  floor: data[i].floor_str,
                  notify_token: user.notify_token,
                };

                await Notify.Push(house);
              }

              const newHouseId = data[0].post_id;

              await Condition.findOneAndUpdate(
                {
                  _id: response.condition._id,
                },
                { house_id: newHouseId },
              );
              console.log(
                `Rent       :: ${response.condition.name} Update ${newHouseId} to House ID`,
              );

              return console.log(
                `Rent       :: ${index + 1}. ${
                  response.condition.name
                } Fetch Rent data Finish`,
              );
            });

            await axios.all(notifyPromises);
          }),
        );
    } catch (error) {
      console.log(error);
    }

    console.log(
      `Rent       :: -----  ${moment().format('YYYY-MM-DD hh:mm:ss')}  -----`,
    );
    console.log('Rent       :: ----- Fetch Rent data Finish -----');
  }

  public static async HouseId(formData: Partial<ConditionProps>) {
    if (!fs.existsSync('./token.json')) {
      await axios.get(`${Locals.config().url}/api/fetch/token`);
    }

    const url = Format.conditionToUrl(formData);

    const headers = await Format.Headers(formData.region as string);

    const rentResponse = await axios.get(url, { headers });

    const houseId = rentResponse.data.data.data[0].post_id;

    return houseId;
  }

  public static async renewHouseId(req: Request, res: Response) {
    try {
      const conditions = await Condition.find();

      conditions.forEach(async (condition) => {
        const houseId = await Fetch.HouseId(condition);
        await Condition.findOneAndUpdate(
          { _id: condition.toObject()._id },
          { house_id: houseId },
        );
      });

      return res.status(200).send({ success: true });
    } catch (error) {
      console.log(error);
    }
  }
}

export default Fetch;

export interface RentUrlProps {
  _id: string;
  name: string; // 條件名稱
  floor: string; // 樓層
  shape: string; // 型態
  kind: string; // 類型
  multiArea: string; // 坪數
  multiNotice: string; // 須知
  multiRoom: string; // 格局
  option: string; // 設備
  other: string; // 特色
  region: string; // 地區
  section: string; // 位置
  price: string; // 租金
  notify_token: string; // LINE notify token
  line_id: string; // LINE id
  houseId: string; // Current id
}
