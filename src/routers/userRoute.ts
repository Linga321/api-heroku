import { Router } from 'express'

import {
  verifyAdmin,
  verifyUserLogin,
  verifyEmail,
  verifyAddress,
  verifyUserId,
} from '../middlewares/userMiddlewares'
import userController from '../controllers/userController'
/**
 * @route get-'' if you're a admin, getting every users and all other related data, 
 * @route get-'/:userId' if you're a admin, getting every users and all other related data, 
 * @route post-'' if you're a admin, creating new user using title,description,discount,price,quantity,categoryId,imagesId
 * @route put-'/:userId' if you're a user, update single user and using userId and title,description,discount,price,quantity,categoryId,imagesId,
 * @route delete-'/:userId' if you're a admin, deleting single user and all other related data using userId, 
 * @route get-':userId/address' if your a admin, getting every all user addressId and all other related data, 
 * @route post-':userId/address' if you're a user, creating new user addressId using street, postcaode, city, country
 * @route get-'/:userId/addressId/' getting single user address using userId
 * @route put-'/:userId/address/addressIdId' if you're a user, update single user addressId and using userId , place street, postcaode, city, country
 * @route delete-'/:userId/address/addressIdId' if you're a admin, deleting single user addressId and all other related data using userId, 
 */
const userRoute = Router()

userRoute.get('/:page/:limit/:sort', verifyAdmin, userController.getAllUsers)

userRoute.get('/:userId', verifyUserLogin, userController.getSingleUser)

userRoute.post('', verifyEmail, userController.createUser)

userRoute.put('/:userId', verifyUserLogin, verifyUserId, userController.updateUser)

userRoute.delete('/:userId', verifyAdmin,verifyUserId, userController.deleteUser)

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
