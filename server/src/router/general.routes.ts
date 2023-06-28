import { Router } from 'express';
import GeneralController from '../controllers/general.controller.js';

/* Access router instance */
const router = Router();

/* Assign methods to routes */
router.get('/health', GeneralController.health);

export default router;
