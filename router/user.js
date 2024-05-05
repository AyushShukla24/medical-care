import express from 'express'
import { deleteUser, getAllUser, getSingleUser, updateUser, getMyAppointments, getUserProfile} from '../controllers/userController.js'
import {authenticate,restrict} from '../authentication/verifyToken.js'

const router=express.Router()

router.get('/:id',authenticate,restrict(['patient']),getSingleUser)
router.get('/',authenticate,restrict(['admin']),getAllUser)
router.put('/:id',authenticate,restrict(['patient']),updateUser)
router.delete('/:id',authenticate,restrict(['patient']),deleteUser)
router.get('/profile/me',authenticate,restrict(['patient']),getUserProfile)
router.get('/appointments/my-appointments',authenticate,restrict(['patient']),getMyAppointments)

export default router;