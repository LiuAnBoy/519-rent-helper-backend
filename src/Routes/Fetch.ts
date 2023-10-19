import { Router } from 'express';

import Fetch from '../Controller/app/Fetch';
import Token from '../Controller/app/Token';

const router = Router();

router.get('/rent', Fetch.Rent);
router.get('/token', Token.getToken);

export default router;
