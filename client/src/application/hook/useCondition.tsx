import { createContext, useContext, useState } from 'react';
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
  putRequest,
} from '../../service/http';
import { ProfileContextProps, UserContext } from './useUser';

export const ConditionContext = createContext<ConditionContextProps>(
  {} as ConditionContextProps
);

const useCondition = () => {
  const [condition, setCondition] = useState<Partial<ConditionProps>>({
    _id: '',
    name: '',
    push: true,
    user_id: '',
    floor: '',
    shape: [],
    kind: '',
    multiArea: [],
    multiNotice: [],
    multiRoom: [],
    option: [],
    other: [],
    region: '1',
    section: [],
    price: [],
    max_price: '',
    min_price: '',
    max_area: '',
    min_area: '',
  });
  // const [conditionList, setConditionList] = useState<ConditionProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { conditionList, setConditionList } = useContext(
    ConditionContext
  ) as ConditionContextProps;
  const { user, setUser } = useContext(UserContext) as ProfileContextProps;

  const requestGetConditionList = async (uId: string) => {
    try {
      setIsLoading(true);
      const res = await getRequest<ConditionResponseProps>(
        `/api/condition/all/${uId}`
      );
      return res;
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const requestGetCondition = async (id: string) => {
    try {
      setIsLoading(true);
      const res = await getRequest<ConditionResponseProps>(
        `/api/condition/${id}`
      );
      res?.success && setCondition(res.data as ConditionProps);
      setIsLoading(false);
      return res;
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const requestCreateCondition = async (data: ConditionProps) => {
    try {
      setIsLoading(true);
      const res = await postRequest<ConditionResponseProps>(
        `/api/condition/create`,
        data
      );
      if (res && res.success) {
        setConditionList([...conditionList, res.data as ConditionProps]);
        setUser({ ...user, condition: user.condition + 1 });
        setCondition({ ...(res.data as ConditionProps) });
      }
      setIsLoading(false);
      return res;
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const requestUpdateCondition = async (data: ConditionProps) => {
    try {
      setIsLoading(true);
      const res = await putRequest<ConditionResponseProps>(
        `/api/condition/update/${data._id}`,
        data
      );

      const new_conditionList = conditionList.map(c => {
        if (c._id === data._id) {
          c = data;
        }
        return c;
      });
      setConditionList(new_conditionList);
      setCondition(data);
      setIsLoading(false);
      return res;
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const requestChangePush = async (id: string) => {
    try {
      setIsLoading(true);
      const res = await patchRequest<ConditionResponseProps>(
        `/api/condition/push/${id}`
      );
      const new_conditionList = conditionList.map(c => {
        if (c._id === id) {
          c.push = !c.push;
        }
        return c;
      });
      setConditionList(new_conditionList);
      setIsLoading(false);
      return res;
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const requestDeleteCondition = async (id: string) => {
    try {
      setIsLoading(true);
      const res = await deleteRequest<ConditionResponseProps>(
        `/api/condition/delete/${id}`
      );
      const newConditionList = conditionList.filter(c => c._id !== id);
      setConditionList(newConditionList);
      const new_user = { ...user, condition: user.condition - 1 };
      setUser(new_user);
      setIsLoading(false);
      return res;
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return {
    condition,
    setCondition,
    setConditionList,
    requestGetCondition,
    requestCreateCondition,
    requestChangePush,
    requestGetConditionList,
    requestUpdateCondition,
    requestDeleteCondition,
  };
};

export default useCondition;

export interface ConditionContextProps {
  conditionList: ConditionProps[];
  setConditionList: React.Dispatch<React.SetStateAction<ConditionProps[]>>;
}

export interface ConditionResponseProps {
  success: boolean;
  message: string;
  data?: ConditionProps | ConditionProps[];
}

export interface ConditionProps {
  _id: string;
  name: string;
  push: boolean;
  house_id: string;
  user_id: string;
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
}
