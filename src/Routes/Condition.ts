import { Router } from 'express';

import Condition from '../Controller/api/Condition';
import auth from '../Middleware/Auth';

const router = Router();

router.get('/all/:uId', Condition.getAllCondition);
router.get('/:cId', Condition.getCondition);
router.post('/create', auth, Condition.createCondition);
router.put('/update/:cId', auth, Condition.updateCondition);
router.patch('/push/:cId', auth, Condition.changePush);
router.delete('/delete/:cId', auth, Condition.deleteCondition);

export default router;
