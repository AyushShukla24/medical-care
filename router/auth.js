import express from 'express'
import {register,login,verification} from '../controllers/authController.js'

const router=express.Router()

router.post('/register',register)
router.post('/login',login)
router.get('/verify',verification);

export default router;