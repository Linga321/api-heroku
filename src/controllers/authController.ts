import { Request, Response, NextFunction } from 'express'
import jwt_ from 'jwt-simple'

import AuthService from '../services/authService'
import stringGenerator from '../util/randomString'
import { NotFoundError, UnauthorizedError, InternalServerError } from '../helpers/apiError'
import Auth from '../models/Auth'
import { getValidToken } from '../middlewares/userMiddlewares'

const userLogin = async (req: Request, res: Response,next: NextFunction) => {
  const { email, password } = req.body
  const authUser = await AuthService.userLogin(email, password)
  if (authUser) {
    const foundAuth = await AuthService.getAuthByUserIdAndStatus(authUser._id, 'Login') // check if already logined
    if (!foundAuth) {
      // to store login data with time
      const loginInfo = new Auth({
        userId: authUser._id,
        token: stringGenerator.tokenGenerator(),
        status: 'Login', // login status
      })
      const loginToken = await  AuthService.insertAuth(loginInfo)
      if (!loginToken) {
        next(new InternalServerError('While storing new auth error occurred'))
      }
      return res.json({ token: loginToken.token })
    }
    return res.json({ token: foundAuth.token }) // user not logout yet, 
  } else {
    next(new UnauthorizedError('Username or password incorrect'))
  }
}

const userLogout = async (req: Request, res: Response,next: NextFunction) => {
  const token = await getValidToken(req,res,next)
  const user = await AuthService.userLogout(token)
  return res.redirect('/')
}

const getUserProfile = async (req: Request, res: Response ,next: NextFunction) => {
  const token = await getValidToken(req,res,next)
  const auth = (await AuthService.getUserProfile(token))
  console.log(token, auth)
  if (auth) {
    return res.json(auth)//res.json(jwt_.encode(auth, 'test_key'))
  } else {
    next(new UnauthorizedError('User token invalid'))
  }
}

const getAllAuths = async (req: Request, res: Response, next: NextFunction) => {
  const authList = await AuthService.getAllAuths()
  if (!authList) {
    next(new NotFoundError('Empty List'))
  }
  return res.json(authList)
}

const getAuthByUserId = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params
  const auth = await AuthService.getAuthByUserId(userId)
  if (!auth) {
    next(new NotFoundError(`Auth not found for userId ${userId}`))
  }
  return res.json(auth)
}

const getSingleAuth = async (req: Request, res: Response, next: NextFunction) => {
  const { authId } = req.params
  const auth = await AuthService.getSingleAuth(authId)
  if (auth) {
    return res.json(auth)
  } else {
    next(new NotFoundError(`Auth not found for AuthId ${authId}`))
  }
}

// update time lock time
const updateAuth = async (req: Request, res: Response,  next: NextFunction) => {
  const { authId } = req.params
  const auth = req.body
  const authUpdate = await AuthService.updateAuth(authId, auth)
  if (authUpdate) {
    next(new NotFoundError(`Auth not Update`))
  }
  return res.json(authUpdate)
}

const deleteAuth = async (req: Request, res: Response,  next: NextFunction) => {
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
