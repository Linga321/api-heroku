import { Router } from 'express'
import passport from 'passport'
import authController from '../controllers/authController'

import userController from '../controllers/userController'
import { verifyUserLogin } from '../middlewares/userMiddlewares'

const authRoute = Router()

authRoute.post('/login', authController.userLogin)

authRoute.get('/profile', authController.getUserProfile)

authRoute.get('/logout', authController.userLogout)

export default authRoute
