import { Request, Response, NextFunction } from 'express'
import { ObjectId } from 'mongoose'
import bcrypt from 'bcrypt'

import User, { UserDocument, UserRole } from '../models/User'
import { BadRequestError, NotFoundError } from '../helpers/apiError'
import userService from '../services/userService'
import cartService from '../services/cartService'
import Address from '../models/Address'

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = req.body
  const newUser = await userService.insertUser(new User(user))
  if (!newUser || !user) {
    next(new BadRequestError(`user informtion not saved`))
  } else {
    return res.status(201).json(newUser)
  }
}

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  const users = await userService.getAllUsers()
  if (!users) {
    next(new NotFoundError(`user informtion empty`))
  } else {
    return res.status(200).json(users)
  }
}

const getSingleUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params
  const user = await userService.getSingleUser(userId)
  if (!user || !userId) {
    next(new NotFoundError(`user informtion not correct or empty field`))
  } else {
    return res.status(200).json(user)
  }
}

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params
  const { user , password} = req.body
  if(user.password){
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
  const updatedUser = await userService.updateUser(userId, password, user)
  if (!updatedUser || !userId) {
    next(new NotFoundError(`user informtion not updated`))
  } else {
    return res.status(200).json(updatedUser)
  }
}

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params
  const deletedUser = await userService.deleteUser(userId)
  if (!deletedUser || !userId) {
    next(new NotFoundError(`user informtion not deleted`))
  } else {
    return res.status(204).json(deletedUser)
  }
}
const getAllUsersAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const addresses = await userService.getAllUsersAddress()
  if (!addresses) {
    next(new NotFoundError(`Address informtion is empty`))
  } else {
    return res.status(204).json(addresses)
  }
}

const insertUserAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params
  const { address, place } = req.body
  if (!userId || !address || !place) {
    next(new BadRequestError(`valid userId, address and place needed`)) // if one of the data missing send error message
  } else {
    const foundUser = await userService.getSingleUser(userId)
    if (!foundUser) {
      next(new BadRequestError(`ivalid userId ${userId}`)) // if one of the data missing send error message
    } else {
      const existedUserAddress = foundUser?.address // getting array of user address if exist
      const foundAddress = await userService.findAddress(address) // find if there are address same as new address
      const foundUserAddress = await userService.findUserAddress({ // check if user have the same address _id 
        _id: userId,
        'address.user_address': {
          $all: [foundAddress?._id],
        },
      }) // check user have this address
      if (foundUserAddress) {
        next(new BadRequestError(`User have same exiting address`))
      } else {
        let user_address: any = { address: [] }
        if (!foundAddress) {
          // if address existed on store get the id or create new address
          const newAddress = await userService.insertUserAddress(
            new Address(address)
          )
          user_address.address.push({
            user_address: newAddress._id,
            place: place,
          })
        } else {
          user_address.address.push({
            user_address: foundAddress._id,
            place: place,
          })
        }

        if (existedUserAddress) {
          if (existedUserAddress?.length > 2) {
            next(new BadRequestError(`Only allowed address per user is three`))
          } else {
            existedUserAddress.map((address) => {
              user_address.address.push({
                user_address: address.user_address,
                place: address.place,
              }) // getting and push all address
            })
          }
        } else {
          const updateedAddress = await userService.updateUserAddress(
            userId,
            user_address
          )
          if (!updateedAddress) {
            next(new BadRequestError(`Ivalid user Address informtion`))
          } else {
            return res.status(204).json(updateedAddress?.address)
          }
        }
      }
    }
  }
}

const getSingleUserAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params
  const deletedUser = await userService.deleteUser(userId)
  if (deletedUser) {
    cartService.deleteCartByUserId(userId)
  }
  return res.status(204).json(deletedUser)
}
const deleteUserAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params
  const deletedUser = await userService.deleteUser(userId)
  if (deletedUser) {
    cartService.deleteCartByUserId(userId)
  }
  return res.status(204).json(deletedUser)
}
const updateUserAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params
  const deletedUser = await userService.deleteUser(userId)
  if (deletedUser) {
    cartService.deleteCartByUserId(userId)
  }
  return res.status(204).json(deletedUser)
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
  updateUserAddress,
}
