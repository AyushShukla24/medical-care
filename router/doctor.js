import express from 'express'
import { deletedoctor, getAlldoctor, getDoctorProfile, getSingledoctor, updatedoctor } from '../controllers/doctorController.js'
import { authenticate, restrict } from '../authentication/verifyToken.js'
import reviewRouter from './review.js'

const router=express.Router()

//nested route
router.use('/:doctorId/reviews',reviewRouter)


router.get('/:id',getSingledoctor)
router.get('/',getAlldoctor)
router.put('/:id',authenticate,restrict(['doctor']),updatedoctor)
router.delete('/:id',authenticate,restrict(['doctor']),deletedoctor)
router.get('/profile/me',authenticate,restrict(['doctor']),getDoctorProfile)

export default router;