import User, { UserDocument } from '../models/User'

import { NotFoundError } from '../helpers/apiError'
import Address, { AddressDocument } from '../models/Address'

const getAllUsers = async (): Promise<UserDocument[]> => {
  return await User.find()
}

const insertUser = async (user: UserDocument): Promise<UserDocument> => {
  return await user.save()
}

const getSingleUser = async (userId: string): Promise<UserDocument | null> => {
  return await User.findById(userId).populate('avatar')
}

const getUserByEmail = async (email: string): Promise<UserDocument | null> => {
  return await User.findOne({ email: email })
}

const deleteUser = async (userId: string): Promise<UserDocument | null> => {
  return await User.findByIdAndDelete(userId)
}

const updateUser = async (
  userId: string,
  password: string,
  updatedObject: Partial<UserDocument>
): Promise<UserDocument | null> => {
  const foundUser = await User.findOne({ _id: userId })
  const checkPassword = await foundUser?.comparePassword(password)
  if (foundUser && checkPassword) {
    return await User.findByIdAndUpdate(userId, updatedObject)
  } else {
    return null
  }
}

const getAllUsersAddress = async (): Promise<AddressDocument[]> => {
  return await Address.find()
}

const insertUserAddress = async (
  address: AddressDocument
): Promise<AddressDocument> => {
  return await address.save()
}

const getSingleUserAddresses = async (addressId: string[]) => {
  return await Address.find({_id:{ $in : addressId }})
}

const updateUserAddress = async (
  userId: string,
  updatedObject: Partial<UserDocument>
): Promise<UserDocument | null> => {
  return await User.findByIdAndUpdate(userId, updatedObject)
}
const findUserAddress = async (findObject: any): Promise<UserDocument | null> => {
  return await User.findOne(findObject)
}

const deleteUserAddress = async (
  addressId: string
): Promise<AddressDocument | null> => {
  return await Address.findByIdAndDelete(addressId)
}

const updateAddress = async (
  userId: string,
  updatedObject: Partial<AddressDocument>
): Promise<AddressDocument | null> => {
  return await Address.findByIdAndUpdate(userId, updatedObject)
}

const findAddress = async (findObject: any): Promise<AddressDocument | null> => {
  return await Address.findOne(findObject)
}

export default {
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
  getUserByEmail,
  insertUser,
  getAllUsersAddress,
  insertUserAddress,
  getSingleUserAddresses,
  deleteUserAddress,
  updateAddress,
  updateUserAddress,
  findAddress,
  findUserAddress,
}
