import { Router } from 'express';

import Condition from './Condition';
import Fetch from './Fetch';

const router = Router();

router.use('/condition', Condition);
router.use('/fetch', Fetch);

export default router;
