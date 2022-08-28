import CartModel, { CartDocument } from '../models/Cart'

const getAllCarts = async () => {
  return await CartModel.find()
}

const getAllCartsPipline = async () => {
  return await CartModel.find()
}

const getCartByUserId = async (userId: string, status: string) => {
  return await CartModel.find({
    userId: userId,
    status: status,
  }).populate({
    path: 'products.productId',
    model: 'Product',
    populate: [
      {
        path: 'imagesId',
        model: 'Image',
      },
    ],
  })
}

const insertCart = async (cart: CartDocument) => {
  return await cart.save()
}

const getSingleCartById = async (cartId: string) => {
  return CartModel.findOne({ cartId })
}

const updateCart = async (id: string, update: Partial<CartDocument>) => {
  return await CartModel.findByIdAndUpdate(id, update)
}

const deleteCart = async (id: string) => {
  return await CartModel.findByIdAndDelete(id)
}

const deleteCartByUserId = async (userId: string) => {
  return await CartModel.find({ userId: userId })
}

export default {
  insertCart,
  getAllCartsPipline,
  getCartByUserId,
  getAllCarts,
  updateCart,
  getSingleCartById,
  deleteCart,
  deleteCartByUserId,
}
