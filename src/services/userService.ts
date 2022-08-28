import User, { UserDocument } from '../models/User'
import Address, { AddressDocument } from '../models/Address'
import Review from '../models/Review'
import Product from '../models/Product'
import Cart from '../models/Cart'

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
  await Review.deleteMany({ userId: userId })
  await Product.deleteMany({ userId: userId })
  await Cart.deleteMany({ userId: userId })
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

const getSingleUserAddresses = async (userId: string) => {
  return await User.find({ _id: userId }, { address: 1 }).populate([
    'address.userAddress',
  ])
}

const updateUserAddress = async (
  userId: string,
  updatedObject: Partial<UserDocument>
): Promise<UserDocument | null> => {
  return await User.findByIdAndUpdate(userId, updatedObject)
}
const findUserAddress = async (
  findObject: any
): Promise<UserDocument | null> => {
  return await User.findOne(findObject)
}

const deleteUserAddress = async (addressId: string, userId: string) => {
  await User.update(
    { _id: userId, address: { $elemMatch: { userAddress: addressId } } },
    { $pull: { 'address.$.userAddress': addressId } }
  )
  return await User.find({ _id: userId })
}

const deleteAddress = async (addressId: string) => {
  await User.update(
    {
      address: {
        $elemMatch: {
          userAddress: addressId,
        },
      },
    },
    {
      $pull: {
        address: {
          userAddress: addressId,
        },
      },
    }
  )
  return await Address.findByIdAndDelete(addressId)
}

const updateAddress = async (
  userId: string,
  updatedObject: Partial<AddressDocument>
): Promise<AddressDocument | null> => {
  return await Address.findByIdAndUpdate(userId, updatedObject)
}

const findAddress = async (
  findObject: any
): Promise<AddressDocument | null> => {
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
  deleteAddress,
  updateAddress,
  updateUserAddress,
  findAddress,
  findUserAddress,
}
