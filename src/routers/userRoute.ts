import { Router } from 'express'
import passport from 'passport'

import { verifyAdmin, verifyUserLogin, verifyEmail, verifyAddress } from '../middlewares/userMiddlewares'
import userController from '../controllers/userController'
//import fileUpload from '../middlewares/multerService'

const userRoute = Router()

userRoute.get('',verifyAdmin,userController.getAllUsers)

userRoute.get('/:userId', verifyUserLogin, userController.getSingleUser)

userRoute.put('/:userId',verifyUserLogin,  userController.updateUser)

userRoute.post('', verifyEmail, userController.createUser)

userRoute.delete('/:userId', verifyAdmin, userController.deleteUser)

userRoute.get('address',verifyAdmin,userController.getAllUsers)

userRoute.get('/:userId/address/:addressId', verifyUserLogin, userController.getSingleUser)

userRoute.put('/:userId/address/:addressId',verifyUserLogin,  userController.updateUser)

userRoute.post('/:userId/address', verifyAddress,  userController.insertUserAddress)

userRoute.delete('/:userId/address/:addressId', verifyUserLogin, userController.deleteUser)

export default userRoute
