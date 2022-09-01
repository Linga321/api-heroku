import Auth, { AuthDocument } from '../models/Auth'
import User from '../models/User'

import userService from './userService'

const getAllAuths = async (): Promise<AuthDocument[]> => {
  return await Auth.find()
}

const insertAuth = async (userData: AuthDocument) => {
  return await userData.save()
}

const getSingleAuth = async (authId: string): Promise<AuthDocument | null> => {
  return await Auth.findById(authId)
}

const getAuthByUserId = async (
  userId: string
): Promise<AuthDocument | null> => {
  return await Auth.findOne({ userId: userId })
}
const getAuthByUserIdAndStatus = async (
  userId: string,
  status: string
): Promise<AuthDocument | null> => {
  return await Auth.findOne({ userId: userId, status: status }) // check if already logined
}
const getAuthByUserToken = async (token: string) => {
  // get data using token and get spec fields
  return await Auth.findOne(
    { token: token },
    { _id: 0, token: 0, createdAt: 0, updatedAt: 0 }
  ).populate({
    path: 'userId',
    select: {
      _id: 1,
      firstName: 1,
      lastName: 1,
      email: 1,
      role: 1,
      avatar: 1,
      phone: 1,
    },
  })
}
const getUserProfile = async (token: string) => {
  // get data using token and get spec fields
  const auth = await Auth.findOne({ token: token })
  if (auth) {
    return await userService.getSingleUser(auth.userId as string)
  } else {
    return null
  }
}
const deleteAuth = async (authId: string): Promise<AuthDocument | null> => {
  return await Auth.findByIdAndDelete(authId)
}

const updateAuth = async (
  authId: string,
  updatedObject: Partial<AuthDocument>
): Promise<AuthDocument | null> => {
  return await Auth.findByIdAndUpdate(authId, updatedObject)
}

const userLogin = async (email: string, password: string) => {
  const foundUser = await User.findOne({ email: email })
  const checkPassword = await foundUser?.comparePassword(password)
  if (foundUser && checkPassword) {
    return foundUser
  } else {
    return null
  }
}

const userLogout = async (token: string) => {
  return await Auth.updateOne(
    { token: token },
    {
      $set: {
        status: 'Logout',
        token: null,
      },
    }
  )
}

export default {
  getAllAuths,
  getSingleAuth,
  getAuthByUserId,
  getAuthByUserToken,
  getAuthByUserIdAndStatus,
  getUserProfile,
  deleteAuth,
  updateAuth,
  insertAuth,
  userLogin,
  userLogout,
}
