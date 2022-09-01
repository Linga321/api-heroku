import Address, { AddressDocument } from '../models/Address'

const getAllAddresss = async (): Promise<AddressDocument[]> => {
  return await Address.find()
}

const insertAddress = async (
  address: AddressDocument
): Promise<AddressDocument> => {
  return await address.save()
}

const getSingleAddress = async (
  addressId: string
): Promise<AddressDocument | null> => {
  return await Address.findById(addressId)
}

const getAddressByEmail = async (
  email: string
): Promise<AddressDocument | null> => {
  return await Address.findOne({ email })
}

const deleteAddress = async (
  addressId: string
): Promise<AddressDocument | null> => {
  return await Address.findByIdAndDelete(addressId)
}

const updateAddress = async (
  addressId: string,
  updatedObject: Partial<AddressDocument>
): Promise<AddressDocument | null> => {
  return await Address.findByIdAndUpdate(addressId, updatedObject)
}

export default {
  getAllAddresss,
  getSingleAddress,
  deleteAddress,
  updateAddress,
  getAddressByEmail,
  insertAddress,
}
