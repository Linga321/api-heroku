import CartModel, { CartDocument } from '../models/Cart'

const getAllCartsByPagination = async (
  page: number,
  limit: number,
  sort: string
) => {
  return await CartModel.find()
    .sort({ [sort]: 1 })
    .skip(page * limit)
    .limit(limit)
}

const getCartByUserIdByPagination = async (
  userId: string,
  status: string,
  page: number,
  limit: number,
  sort: string
) => {
  return await CartModel.find({
    userId: userId,
    status: status,
  })
  .sort({ [sort]: 1 })
  .skip(page * limit)
  .limit(limit)
  .populate({
    path: 'products.productId',
    model: 'Product',
    populate: [
      {
        path: 'imagesId',
        model: 'Image',
      },
      {
        path: 'categoryId',
        model: 'Category',
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
  getAllCartsByPagination,
  getCartByUserIdByPagination,
  updateCart,
  getSingleCartById,
  deleteCart,
  deleteCartByUserId,
}
