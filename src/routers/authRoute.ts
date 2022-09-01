import { Router } from 'express'
import { verifyUserLogin } from '../middlewares/userMiddlewares'

import authController from '../controllers/authController'
/**
 * @route post-'/login' for posting login information using email, passowrd; return new token every login
 * @route get-'/profile' getting single user information using toekn stored in database
 * @route get-'/:logout' logout single user and remove current token using token, 
 */
const authRoute = Router()

authRoute.post('/login', authController.userLogin)

authRoute.get('/profile', verifyUserLogin, authController.getUserProfile)

authRoute.get('/logout', verifyUserLogin, authController.userLogout)

export default authRoute
