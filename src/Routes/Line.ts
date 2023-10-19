import { Router } from 'express';

import Notify from '../Controller/line/notify';

const router = Router();

router.get('/notify/token', Notify.CombineNotify);

export default router;
