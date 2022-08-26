import { Request, Response, NextFunction } from 'express'

import { CustomError } from '../types/ErrorTypes'
import { UnauthorizedError, ForbiddenError } from '../helpers/apiError'
import authService from '../services/authService'
import userService from '../services/userService'
require('dotenv').config()

export const getValidToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers
  const token = authorization ? authorization.split(' ')[1] : ''
  if (!token) {
    next(new UnauthorizedError(`invalid token credentials`))
  }
  return token
}
export const verifyUserLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = await getValidToken(req, res, next)
  const foundUser = await authService.getAuthByUserToken(token)
  if (foundUser) {
    next()
  } else {
    next(new UnauthorizedError(`User credentials are wrong`))
  }
}

export const verifyAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = await getValidToken(req, res, next)
  const user = (await authService.getAuthByUserToken(token))?.toJSON()
  if (user?.userId.role ==="Admin") {
    next()
  } else {
    next(new ForbiddenError(`User is not allowed to view this content`))
  }
}

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req.body
  const foundEmail = await userService.getUserByEmail(user.email)
  console.log('foundEmail:', foundEmail)
  if (!foundEmail) {
    next()
  } else {
    next(new ForbiddenError(`Email Already exist`))
  }
}

export const verifyAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next()
  const { street  } = req.body
  const token = await getValidToken(req, res, next)
  const user = (await authService.getAuthByUserToken(token))?.toJSON()
  const foundAddress = await userService.findAddress(street)
  const founduserAddress = userService.findUserAddress({_id:user?._id, 'address.user_address': foundAddress?._id})
  if (!founduserAddress) {
    next()
  } else {
    next(new ForbiddenError(`Address Already exist`))
  }
}
