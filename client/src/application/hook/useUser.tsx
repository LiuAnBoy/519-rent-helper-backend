import { createContext } from 'react';
import { postRequest } from '../../service/http';

export const UserContext = createContext<ProfileContextProps>(
  {} as ProfileContextProps
);

const useUser = () => {
  const requestLiffLogin = async (code: string) => {
    const data = {
      code,
    };

    try {
      const res = await postRequest<ProfileResponseProps>(
        '/auth/liff/login',
        data
      );
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    requestLiffLogin,
  };
};

export default useUser;

export interface ProfileContextProps {
  user: ProfileProps;
  setUser: React.Dispatch<React.SetStateAction<ProfileProps>>;
}

export interface ProfileResponseProps {
  success: boolean;
  data: ProfileProps;
}

export interface ProfileProps {
  _id: string;
  name: string;
  email: string;
  picture: string;
  line_id: string;
  condition: number;
  notify_token: string;
  notify_count: number;
  exp: number;
  iat: number;
}
