import { Router } from 'express';

import { handleMultiple, handleSingle  } from './routes/data'

const router = Router({ strict: true, caseSensitive: true });

router.use('/data/one', handleSingle);
router.use('/data/many', handleMultiple);
router.use('/', (_, res) => res.status(200).json('Ping!'));

export default router