import { RouteProps } from '.';
import LoginPage from '../pages/auth/login';

const authRoutes: RouteProps[] = [
  {
    path: '/user/login',
    view: LoginPage,
  },
];

export default authRoutes;