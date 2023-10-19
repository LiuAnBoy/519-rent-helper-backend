import { Router } from 'express';

import Auth from '../Controller/api/Auth';

const router = Router();

router.post('/liff/login', Auth.liffLogin);

router.get('/login', Auth.Login);

export default router;
