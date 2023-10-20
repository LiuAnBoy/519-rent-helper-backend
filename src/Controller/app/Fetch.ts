import fs from 'fs-extra';
import queryString from 'query-string';
import axios from 'axios';
import moment from 'moment';

import Notify, { IHouse } from '../line/notify';
import Condition, { ConditionProps, ICondition } from '../../Models/condition';
import Locals from '../../Provider/Locals';
import { IUser } from '../../Models/user';

class Fetch {
  public static async Rent() {
    console.log('Rent       :: ----- Start fetch Rent data -----');
    console.log(
      `Rent       :: -----  ${moment().format('YYYY-MM-DD hh:mm:ss')}  -----`,
    );

    const headers = {
      'X-CSRF-TOKEN': '',
      Cookie: '',
    };

    const readData = await fs.readJson('./token.json');
    headers['X-CSRF-TOKEN'] = readData.csrfToken;

    try {
      const conditions = await Condition.find({
        push: true,
      }).populate<{ user: IUser }>('user_id');

      const updateCondition = async (
        _id: string,
        houseId: string,
        name: string,
        index: number,
      ) => {
        await Condition.findOneAndUpdate(
          {
            _id,
          },
          { house_id: houseId },
        );
        return console.log(
          `Rent       :: ${index + 1}. ${name} Update ${houseId} to House ID`,
        );
      };

      axios
        .all(
          conditions.map(async (condition: ICondition) => {
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
            if (condition.multiNotice)
              query.multiNotice = condition.multiNotice;
            const baseUrl = Locals.config().rentApiUrl;
            const url = queryString.stringifyUrl({
              url: baseUrl,
              query: {
                ...query,
                orderType: 'desc',
              },
            });
            headers.Cookie = `${readData.cookie}urlJumpIp=${condition.region};`;
            const rentData = await axios.get(url, { headers });
            return { condition, rentData };
          }),
        )
        .then(
          axios.spread((...responses) => {
            responses.forEach((response, index) => {
              console.log(
                `Rent       :: ${index + 1}. ${
                  response.condition.name
                } Fetch Rent Data Start`,
              );
              const data = response.rentData.data.data.data;

              if (response.condition.house_id === String(data[0].post_id)) {
                return console.log(
                  `Rent       :: ${index + 1}. ${
                    response.condition.name
                  } No New House`,
                );
              }

              const existConditionIdx = data.findIndex(
                (d: any) => String(d.post_id) === response.condition.house_id,
              );

              const user = response.condition.user_id as IUser;
              for (let i = 0; i < existConditionIdx; i += 1) {
                const house: IHouse = {
                  name: response.condition.name,
                  title: data[i].title,
                  pId: data[i].post_id,
                  section: data[i].section_name,
                  area: data[i].area,
                  price: data[i].price,
                  kind_name: data[i].kind_name,
                  floor: data[i].floor_str,
                };

                Notify.Push(
                  house,
                  user.notify_token,
                  response.condition._id,
                  index,
                );
              }
              /* eslint @typescript-eslint/no-explicit-any: 0 */
              const newHouseId = data[0].post_id;
              updateCondition(
                response.condition._id,
                newHouseId,
                response.condition.name,
                index,
              );

              return console.log(
                `Rent       :: ${index + 1}. ${
                  response.condition.name
                } Fetch Rent data Finish`,
              );
            });
          }),
        )
        .finally(() => {
          console.log(
            `Rent       :: -----  ${moment().format(
              'YYYY-MM-DD hh:mm:ss',
            )}  -----`,
          );
          return console.log(
            'Rent       :: ----- Fetch Rent data Finish -----',
          );
        });
    } catch (error) {
      console.log(error);
    }
  }

  public static async HouseId(formData: Partial<ConditionProps>) {
    if (!fs.existsSync('./token.json')) {
      await axios.get(`${Locals.config().url}/api/fetch/token`);
    }

    const query: Partial<RentUrlProps> = {};
    const baseUrl = Locals.config().rentApiUrl;

    if (formData.region) query.region = formData.region;
    if (formData.section) query.section = formData.section;
    if (formData.kind) query.kind = formData.kind;
    if (formData.shape) query.shape = formData.shape;
    if (formData.floor) query.floor = formData.floor;
    if (formData.price) query.price = formData.price;
    if (formData.multiArea) query.multiArea = formData.multiArea;
    if (formData.multiRoom) query.multiRoom = formData.multiRoom;
    if (formData.option) query.option = formData.option;
    if (formData.other) query.other = formData.other;
    if (formData.multiNotice) query.multiNotice = formData.multiNotice;

    const rentUrl = queryString.stringifyUrl({
      url: baseUrl,
      query: {
        ...query,
        orderType: 'desc',
      },
    });

    const headers = {
      'X-CSRF-TOKEN': '',
      Cookie: '',
    };

    const readData = await fs.readJson('./token.json');
    headers['X-CSRF-TOKEN'] = readData.csrfToken;
    headers.Cookie = `${readData.cookie}urlJumpIp=${formData.region};`;

    const rentResponse = await axios.get(rentUrl, { headers });

    const houseId = rentResponse.data.data.data[0].post_id;

    return String(houseId);
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
