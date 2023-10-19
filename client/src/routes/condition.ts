import { RouteProps } from '.';
import ConditionEditPage from '../pages/condition/edit';
import ConditionCreatePage from '../pages/condition/create';

const conditionRoutes: RouteProps[] = [
  {
    path: '/condition/edit/:id',
    view: ConditionEditPage,
  },
  {
    path: '/condition/create',
    view: ConditionCreatePage,
  },
];

export default conditionRoutes;
