import { Request, Response, NextFunction } from 'express'

import AuthService from '../services/authService'
import stringGenerator from '../util/randomString'
import {
  NotFoundError,
  UnauthorizedError,
  InternalServerError,
} from '../helpers/apiError'
import Auth from '../models/Auth'
import { getValidToken } from '../middlewares/userMiddlewares'
/**
 * Login validation
 * Access Level : None
 * @param req @body email passowrd
 * @param res if user information valid then return token
 * @param next if email or password incorrect/valid return UnauthorizedError
 *              if error occurred while createing token return InternalServerError
 * @returns res
 */
const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  const authUser = await AuthService.userLogin(email, password)
  if (authUser) {
    const foundAuth = await AuthService.getAuthByUserIdAndStatus(
      authUser._id,
      'Login'
    ) // check if already logined
    if (!foundAuth) {
      // to store login data with time
      const loginInfo = new Auth({
        userId: authUser._id,
        token: stringGenerator.tokenGenerator(),
        status: 'Login',
      })
      const loginToken = await AuthService.insertAuth(loginInfo)
      if (!loginToken) {
        next(new InternalServerError('While storing new token error occurred'))
      }
      return res.json({ token: loginToken.token })
    }
    return res.json({ token: foundAuth.token }) // user not logout yet
  } else {
    next(new UnauthorizedError('Username or password incorrect'))
  }
}
/**
 * Logout validation
 * Access Level : User
 * @param req @params token -headers authendication token
 * @param res redirect to home page
 * @param next if user token is not found or invalid UnauthorizedError
 * @returns res
 */
const userLogout = async (req: Request, res: Response, next: NextFunction) => {
  const token = await getValidToken(req)
  if (token) {
    await AuthService.userLogout(token)
  }
  return res.redirect('/')
}
/**
 * Geting User login infomation using token.
 * Access Level : User
 * @param req @params token -headers authendication token
 * @param res if user token is not found or invalid UnauthorizedError
 * @param next if user token is not found or invalid UnauthorizedError
 * @returns res
 */
const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = await getValidToken(req)
  if (token) {
    const auth = await AuthService.getUserProfile(token)
    if (auth) {
      return res.json(auth)
    } else {
      next(
        new UnauthorizedError(
          'User Login invalid, user can not access with only token'
        )
      )
    }
  } else {
    next(new UnauthorizedError('User token invalid'))
  }
}
/**
 * Geting User login infomation using token.
 * Access Level : Admin
 * @param req none, middleware check user level
 * @param res if user token is not found or invalid UnauthorizedError
 * @param next if user token is not found or invalid UnauthorizedError
 * @returns res
 */
const getAllAuths = async (req: Request, res: Response, next: NextFunction) => {
  const authList = await AuthService.getAllAuths()
  if (!authList) {
    next(new NotFoundError('Empty List'))
  }
  return res.json(authList)
}
/**
 * Geting User login infomation using userId.
 * Access Level : User
 * @param req @params userId, for getting user info
 * @param res if user is found in login data, return user
 * @param next if user is not found which login data invalid NotFoundError
 * @returns res
 */
const getAuthByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params
  const auth = await AuthService.getAuthByUserId(userId)
  if (!auth) {
    next(new NotFoundError(`Auth not found for userId ${userId}`))
  } else {
    return res.json(auth)
  }
}
/**
 * Geting User login infomation using authId.
 * Access Level : User
 * @param req  @params authId, for getting user info
 * @param res if user is found in login data, return user
 * @param next if user is not found which login data invalid NotFoundError
 * @returns res
 */
const getSingleAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authId } = req.params
  const auth = await AuthService.getSingleAuth(authId)
  if (auth) {
    return res.json(auth)
  } else {
    next(new NotFoundError(`Auth not found for AuthId ${authId}`))
  }
}
/**
 * Updating User login infomation using authId.
 * Access Level : User
 * @param req @params authId- for updating user info, auth- Login Statu
 *            @body auth - Login Status
 * @param res if user is found in login data, return user
 * @param next if user is not found which login data invalid NotFoundError
 * @returns res
 */
const updateAuth = async (req: Request, res: Response, next: NextFunction) => {
  const { authId } = req.params
  const auth = req.body
  const authUpdate = await AuthService.updateAuth(authId, auth)
  if (authUpdate) {
    next(new NotFoundError('Auth not Update'))
  }
  return res.json(authUpdate)
}
/**
 * Deleteing User login infomation using authId.
 * Access Level : Admin
 * @param req @params authId- for deleting user login info
 * @param res if user is found in login data, return user
 * @param next if user is not found which login data invalid NotFoundError
 * @returns res
 */
const deleteAuth = async (req: Request, res: Response, next: NextFunction) => {
  const { authId } = req.params
  const auth = await AuthService.deleteAuth(authId)
  if (!auth) {
    next(new NotFoundError(`Auth not deleted for using AuthId ${authId}`))
  }
  return res.json(auth)
}

export default {
  getAllAuths,
  getAuthByUserId,
  getSingleAuth,
  updateAuth,
  deleteAuth,
  userLogin,
  getUserProfile,
  userLogout,
}
