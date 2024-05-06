import express from 'express'
import { contactUs } from '../controllers/contactController.js';
import { authenticate,restrict } from '../authentication/verifyToken.js';


const router=express.Router();

router.post('/formSubmit',authenticate,restrict(['patient']),contactUs);

export default router