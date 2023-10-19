import authRoutes from './auth';
import conditionRoutes from './condition';
import homeRoutes from './home';

const routes = [
  ...authRoutes,
  ...homeRoutes,
  ...conditionRoutes,
]

export default routes;

export interface RouteProps {
  path: string;
  view: () => React.ReactElement;
}
