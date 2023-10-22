import fs from 'fs-extra';
import axios, { AxiosError } from 'axios';
import moment from 'moment';
import { Request, Response } from 'express';
import queryString from 'query-string';

import Notify, { NotifyPushProps } from '../line/notify';
import Condition, { ConditionProps, ICondition } from '../../Models/condition';
import Locals from '../../Provider/Locals';
import { IUser } from '../../Models/user';
import Format from './Format';

let retry: number = 0;

/* eslint no-promise-executor-return: 0 */
const sleep = (ms: number = 3000) => new Promise((r) => setTimeout(r, ms));

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

              const data = response.rentData.data.data.data as RentDataProps[];

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
            console.log(
              `Rent       :: -----  ${moment().format(
                'YYYY-MM-DD hh:mm:ss',
              )}  -----`,
            );
            console.log('Rent       :: ----- Fetch Rent data Finish -----');
            retry = 0;
          }),
        );
    } catch (error) {
      const err = error as AxiosError;
      if (err?.status && err.status >= 400) {
        if (err.status === 419) {
          await axios.get(`${Locals.config().url}/api/fetch/token`);
        }
        retry += 1;
        console.log(
          `Rent       :: -----  ${moment().format(
            'YYYY-MM-DD hh:mm:ss',
          )}  -----`,
        );
        console.log('Rent       :: Fetch Rent data Fail');
        await sleep(5000);
        await Fetch.Rent();
        if (retry >= 3) {
          retry = 0;
          console.log('Rent       :: Fetch Rent data Fail 3 times');

          return console.log(
            'Rent       :: ----- Fetch Rent data Finish -----',
          );
        }
      }
    }
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

  public static async testUrl(req: Request, res: Response) {
    const { url } = req.body;

    const parsedUrl = queryString.parseUrl(url);

    const query = parsedUrl.query;

    const region = query.region as string;

    try {
      const headers = await Format.Headers(region);

      const rentData = await axios.get(url, { headers });

      return res
        .status(200)
        .send({ success: true, data: rentData.data.data.data });
    } catch (error) {
      console.log(error);
    }
  }

  public static async testHeaders() {
    const testHeaders = await Format.Headers('1');
    const testUrl =
      'https://rent.591.com.tw/home/search/rsList?is_format_data=1&is_new_list=1&type=1&&region=1&recom_community=1';
    const testResult = await axios.get(testUrl, { headers: testHeaders });

    return testResult.status;
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

export interface RentDataProps {
  title: string;
  post_id: number;
  kind_name: string;
  price: string;
  section_name: string;
  area: string;
  floor_str: string;
}
