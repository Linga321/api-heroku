import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'

import User from '../models/User'
import { BadRequestError, NotFoundError } from '../helpers/apiError'
import userService from '../services/userService'
import Address from '../models/Address'

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = req.body
  const newUser = await userService.insertUser(new User(user))
  if (!newUser || !user) {
    next(new BadRequestError('user informtion not saved'))
  } else {
    return res.status(201).json(newUser)
  }
}

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  const users = await userService.getAllUsers()
  if (!users) {
    next(new NotFoundError('user informtion empty'))
  } else {
    return res.status(201).json(users)
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
    next(new NotFoundError('user informtion not correct or empty field'))
  } else {
    return res.status(201).json(user)
  }
}

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params
  const { user, password } = req.body
  if (user.password) {
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
  }
  const updatedUser = await userService.updateUser(userId, password, user)
  if (!updatedUser || !userId) {
    next(new NotFoundError('user informtion not updated'))
  } else {
    return res.status(201).json(updatedUser)
  }
}

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params
  const deletedUser = await userService.deleteUser(userId)
  if (!deletedUser || !userId) {
    next(new NotFoundError('user informtion not deleted'))
  } else {
    return res.status(201).json(deletedUser)
  }
}
const getAllUsersAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const addresses = await userService.getAllUsersAddress()
  if (!addresses) {
    next(new NotFoundError('Address informtion is empty'))
  } else {
    return res.status(201).json(addresses)
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
    next(new BadRequestError('valid userId, address and place needed')) // if one of the data missing send error message
  } else {
    const foundUser = await userService.getSingleUser(userId)
    const existedUserAddress = foundUser?.address // getting array of user address if exist
    const userAddress: any = { address: [] }
    const foundAddress = await userService.findAddress(address)
    if (!foundAddress) {
      // if not address existed on store create new address
      const newAddress = await userService.insertUserAddress(
        new Address(address)
      )
      if (newAddress) {
        userAddress.address.push({
          userAddress: newAddress._id,
          place: place,
        })
      }
    } else {
      // if address existed on store use old address id
      userAddress.address.push({
        userAddress: foundAddress?._id,
        place: place,
      })
    }

    if (existedUserAddress) {
      existedUserAddress.map((address) => {
        userAddress.address.push({
          userAddress: address.userAddress,
          place: address.place,
        })
      })
    }

    if (existedUserAddress && existedUserAddress?.length > 2) {
      next(new BadRequestError('Only allowed address per user is three'))
    } else {
      const updateedAddress = await userService.updateUserAddress(
        userId,
        userAddress
      )
      if (!updateedAddress) {
        next(new BadRequestError('Ivalid user Address informtion'))
      } else {
        return res.status(201).json(updateedAddress?.address)
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
  const userAddress = await userService.getSingleUserAddresses(userId)
  if (!userAddress) {
    next(new NotFoundError('User address not found'))
  } else {
    return res.status(201).json(userAddress)
  }
}

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
const updateAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { addressId } = req.params
  const { address } = req.body
  const updateAddress = await userService.updateAddress(addressId, address)
  if (!updateAddress) {
    next(new BadRequestError('User address not updated'))
  } else {
    return res.status(201).json(updateAddress)
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
