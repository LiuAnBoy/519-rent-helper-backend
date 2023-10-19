import { Router } from 'express';

import Fetch from '../Controller/app/Fetch';
import Token from '../Controller/app/Token';
import Format from '../Controller/app/Format';

const router = Router();

router.get('/rent', Fetch.Rent);
router.get('/token', Token.getToken);

router.get('/url/:cId', Format.formatUrl);

export default router;
