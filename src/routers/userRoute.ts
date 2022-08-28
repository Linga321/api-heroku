import { Router } from 'express'

import {
  verifyAdmin,
  verifyUserLogin,
  verifyEmail,
  verifyAddress,
} from '../middlewares/userMiddlewares'
import userController from '../controllers/userController'

const userRoute = Router()

userRoute.get('', verifyAdmin, userController.getAllUsers)

userRoute.get('/:userId', verifyUserLogin, userController.getSingleUser)

userRoute.put('/:userId', verifyUserLogin, userController.updateUser)

userRoute.post('', verifyEmail, userController.createUser)

userRoute.delete('/:userId', verifyAdmin, userController.deleteUser)

userRoute.get('address', verifyAdmin, userController.getAllUsers)

userRoute.get(
  '/:userId/address',
  verifyUserLogin,
  userController.getSingleUserAddress
)

userRoute.put(
  '/:userId/address/:addressId',
  verifyUserLogin,
  userController.updateAddress
)

userRoute.post(
  '/:userId/address',
  verifyAddress,
  userController.insertUserAddress
)

userRoute.delete(
  '/:userId/address/:addressId',
  verifyUserLogin,
  userController.deleteUserAddress
)

export default userRoute
