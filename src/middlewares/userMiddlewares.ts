import { Request, Response, NextFunction } from 'express'

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
    next(new UnauthorizedError('invalid token credentials'))
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
    next(new UnauthorizedError('User credentials are wrong'))
  }
}

export const verifyAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = await getValidToken(req, res, next)
  const user = (await authService.getAuthByUserToken(token))?.toJSON()
  if (user?.userId.role === 'Admin') {
    next()
  } else {
    next(new ForbiddenError('User is not allowed to view this content'))
  }
}

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

export const verifyAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next()
  const { address } = req.body
  const { userId } = req.params
  const foundAddress = await userService.findAddress(address)
  const founduserAddress = await userService.findUserAddress({
    userId,
    'address.userAddress': foundAddress?._id,
  })
  if (!founduserAddress) {
    next()
  } else {
    next(new ForbiddenError('Address Already exist'))
  }
}
