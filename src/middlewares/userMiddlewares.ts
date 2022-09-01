import { Request, Response, NextFunction } from 'express'
import userController from '../controllers/userController'

import {
  UnauthorizedError,
  ForbiddenError,
  BadRequestError,
  NotFoundError,
} from '../helpers/apiError'
import authService from '../services/authService'
import userService from '../services/userService'
require('dotenv').config()

/**
 *
 * @param req headers, get the headers and split authorization get the token
 * @param res if token is not found UnauthorizedError 'invalid token credentials'
 * @returns or return the token
 */
export const getValidToken = async (req: Request) => {
  const { authorization } = req.headers
  const token = authorization ? authorization.split(' ')[1] : ''
  if (!token) {
    return null
  } else {
    return token
  }
}

export const verifyUserLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = await getValidToken(req)
  if (token) {
    const foundUser = await authService.getAuthByUserToken(token)
    if (foundUser) {
      next()
    } else {
      next(new UnauthorizedError('User credentials are wrong'))
    }
  }
}

/**
 *
 * @param req token, using token check, if user is admin or not
 * @param res  if user is not admin the ForbiddenError 'User is not allowed to view this content'
 * @param next  if yes admin user allow to access data and modify them
 */
export const verifyAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = await getValidToken(req)
  if (token) {
    const user = (await authService.getAuthByUserToken(token))?.toJSON()
    if (user?.userId.role === 'Admin') {
      next()
    } else {
      next(new ForbiddenError('User is not allowed to view this content'))
    }
  }
}

/**
 *
 * @param req email to check the email already exist, email in uniqe key
 * @param res if yes, then ForbiddenError 'Email Already exist'
 * @param next or next for user create
 */
export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req.body
  const foundEmail = await userService.getUserByEmail(user.email)
  if (!foundEmail) {
    next()
  } else {
    next(new ForbiddenError('Email Already exist'))
  }
}

/**
 *
 * @param req email to check the email already exist, email in uniqe key
 * @param res if yes, then ForbiddenError 'Email Already exist'
 * @param next or next for user create
 */
export const verifyUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params
  const foundUser = await userService.getSingleUser(userId)
  if (foundUser) {
    next()
  } else {
    next(new NotFoundError(`User not found with userId ${userId}`))
  }
}

/**
 *
 * @param req address (is object {street, city, country and postal code}), userId and place (address name like home/ office)
 * @param res if address already exist the ForbiddenError have dublicated address
 *            if user have 3 address BadRequestError only user can have three address maxnimum
 * @param next  if user address not exit within user's data and lessa than three address
 */
export const verifyAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { address } = req.body
  const { userId } = req.params
  const foundAddress = await userService.findAddress(address)
  if (foundAddress) {
    const foundUserAddress = await userService.findUserAddress({
      _id: userId,
      address: { $elemMatch: { userAddress: foundAddress?._id } },
    })
    const addresses = foundUserAddress?.address // count
    if (!foundUserAddress && addresses && addresses.length < 2) {
      next()
    } else {
      if (addresses && addresses.length > 2) {
        next(new BadRequestError('Only allowed address per user is three'))
      } else {
        next(new ForbiddenError('Address already exist'))
      }
    }
  } else {
    const foundUserAddress = await userService.findUserAddress({
      _id: userId,
    })
    const addresses = foundUserAddress?.address // count
    if (addresses && addresses.length > 2) {
      next(new BadRequestError('Only allowed address per user is three'))
    } else {
      next()
    }
  }
}
