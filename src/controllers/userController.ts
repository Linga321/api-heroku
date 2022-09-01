import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'

import User from '../models/User'
import { BadRequestError, NotFoundError } from '../helpers/apiError'
import userService from '../services/userService'
import Address from '../models/Address'
/**
 * Create user infomation.
 * Access Level : None
 * @param req  @body firstName: string
 *                   lastName: string
 *                   email: string
 *                   password: string
 *                   role?: UserRole (optional)
 *                   avatar?: string (optional)
 *                   phone?: string (optional)
 *                   address?: [ (optional)
 *                                {
 *                                   userAddress: string | ObjectId
 *                                   place: string
 *                                }
 *                              ]
 * @param res if user is created in Users, return user
 * @param next if user is not created BadRequestError
 * @returns res
 */
const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = req.body
  const created = await userService.insertUser(new User(user))
  if (!created || !user) {
    next(new BadRequestError('user informtion not saved'))
  } else {
    return res.status(201).json(created)
  }
}
/**
 * Getting all users infomation.
 * Access Level : Admin
 * @param req none, middleware check user level
 * @param res if users is found in Users, return users
 * @param next if users is not found when Users in empty NotFoundError
 * @returns res
 */
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  const foundUsers = await userService.getAllUsers()
  if (!foundUsers) {
    next(new NotFoundError('user informtion empty'))
  } else {
    return res.status(201).json(foundUsers)
  }
}
/**
 * Getting Sigle user infomation using userId.
 * Access Level : User/Admin
 * @param req @params userId
 * @param res if user is found in user, return user
 * @param next if user is not found NotFoundError
 * @returns res
 */
const getSingleUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params
  const foundUsers = await userService.getSingleUser(userId)
  if (!foundUsers || !userId) {
    next(new NotFoundError('user informtion not correct or empty field'))
  } else {
    return res.status(201).json(foundUsers)
  }
}
/**
 * Updating Sigle user infomation using userId.
 * Access Level : Admin/User
 * if New password is set encript before storing
 * @param req   @params userId - for finding and updating document
 *              @body firstName: string
 *                    lastName: string
 *                    email: string
 *                    password: string
 *                    role?: UserRole (optional)
 *                    avatar?: string (optional)
 *                    phone?: string (optional)
 *                    address?: [ (optional)
 *                                {
 *                                   userAddress: string | ObjectId
 *                                   place: string
 *                                }
 *                              ]
 * @param res if user is updated in user, return user
 * @param next if user is not updated NotFoundError
 * @returns res
 */
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params
  const { user, password } = req.body
  if (user.password) {
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
  }
  const updated = await userService.updateUser(userId, password, user)
  if (!updated) {
    next(new NotFoundError('user informtion not updated'))
  } else {
    return res.status(201).json(updated)
  }
}
/**
 * Deleting Sigle user infomation using userId.
 * Access Level : Admin
 * @param req   @params userId - for finding and deleting document
 * @param res if user is deleted in user, return deleted user
 * @param next if user is not deleted NotFoundError
 * @returns res
 */
const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params
  const deleted = await userService.deleteUser(userId)
  if (!deleted) {
    next(new NotFoundError('user informtion not deleted'))
  } else {
    return res.status(201).json(deleted)
  }
}
/**
 * Getting all user infomation.
 * Access Level : Admin
 * @param req none, middleware check user level
 * @param res if users address is found in user, return users addresses
 * @param next if users address is not found when users in empty NotFoundError
 * @returns res
 */
const getAllUsersAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const foundAddresses = await userService.getAllUsersAddress()
  if (!foundAddresses) {
    next(new NotFoundError('Address informtion is empty'))
  } else {
    return res.status(201).json(foundAddresses)
  }
}
/**
 * Create user address infomation.
 * Access Level : User
 * Find user address exist the use that addressId (If many users' using same address like office)
 * if address not exist create new address push that new address into user
 * Users' max number of address 3
 * @param req  @body street: string
 *                   postal: string
 *                   city: string
 *                   country: string
 * @param res if user is created in user, return user
 * @param next if user is not created BadRequestError
 * @returns res
 */
const insertUserAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params
  const { address, place } = req.body
  if (!userId || !address || !place) {
    next(new BadRequestError('valid userId, address and place needed')) // if one of the data missing send error message
  } else {
    let userAddress
    const foundAddress = await userService.findAddress(address)
    if (!foundAddress) {
      // if not address existed on store create new address
      const createdAddress = await userService.insertUserAddress(
        new Address(address)
      )
      if (createdAddress) {
        userAddress = {
          $push: {
            address: {
              userAddress: createdAddress?._id,
              place: place,
            },
          },
        }
      }
    } else {
      // if address existed on store use old address id
      userAddress = {
        $push: {
          address: {
            userAddress: foundAddress?._id,
            place: place,
          },
        },
      }
    }
    const updatedUser = await userService.updateUserAddress(userId, userAddress)
    if (!updatedUser) {
      next(new BadRequestError('Ivalid user Address informtion'))
    } else {
      return res.status(201).redirect('/carts')
    }
  }
}
/**
 * Getting Sigle user addresses infomation using userId.
 * Access Level : User
 * @param req @params userId
 * @param res if user is found in user, return user
 * @param next if user is not found NotFoundError
 * @returns res
 */
const getSingleUserAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params
  const userAddress = await userService.getSingleUserAddresses(userId)
  if (!userAddress) {
    next(new NotFoundError('User address not found'))
  } else {
    return res.status(201).json(userAddress)
  }
}
/**
 * Deleting Sigle user infomation using userId and addressId.
 * Access Level : Admin
 * Pull/remove user addres from User
 * if only one user is using this address then remove the address from 'Address'
 * @param req   @params userId - for finding and deleting document
 * @param res if user is deleted in user, return user
 * @param next if user is not deleted NotFoundError
 * @returns res
 */
const deleteUserAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, addressId } = req.params
  const deletedUser = await userService.deleteUserAddress(userId, addressId)
  if (!deletedUser) {
    next(new BadRequestError('User address not deleted'))
  } else {
    return res.status(201).json(deletedUser)
  }
}
/**
 * Updating Sigle user infomation using userId.
 * Access Level : Admin
 * Find if any other user is using same address using addressId,
 * If many users' using same address then create the new address
 *  - pull old address using addressId and push new addressId
 * if only one user is usig the address the update address
 * @param req   @params userId - for finding and updating document
 *              @body name    - user Name
 *                    imageId - imageId that stored in Images Data
 * @param res if user is updated in user, return user
 * @param next if user is not updated NotFoundError
 * @returns res
 */
const updateAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params
  const { addressId } = req.params
  const { address, place } = req.body

  const numberOfUsers = await userService.findUserAddresses({
    address: { $elemMatch: { userAddress: addressId } },
  })
  if (numberOfUsers?.length === 1) {
    const updatedAddress = await userService.updateAddress(addressId, address)
    if (!updatedAddress) {
      next(new BadRequestError('User address not updated'))
    } else {
      return res.status(201).json(updatedAddress)
    }
  } else {
    const deletedUserAddress = await userService.deleteUserAddress(
      userId,
      addressId
    )
    if (!deletedUserAddress) {
      next(new BadRequestError('User address not deleted'))
    } else {
      let userAddress
      const createdAddress = await userService.insertUserAddress(
        new Address(address)
      )
      if (createdAddress) {
        userAddress = {
          $push: {
            address: {
              userAddress: createdAddress?._id,
              place: place,
            },
          },
        }
        const updatedUser = await userService.updateUserAddress(
          userId,
          userAddress
        )
        return res.status(201).json(updatedUser)
      } else {
        next(new BadRequestError('User address not updated'))
      }
    }
  }
}
export default {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  getAllUsersAddress,
  insertUserAddress,
  getSingleUserAddress,
  deleteUserAddress,
  updateAddress,
}
