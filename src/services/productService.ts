import ProductModel, { ProductDocument } from '../models/Product'
import { ObjectId } from 'mongoose'

const getAllProductByPagination = async (
  page: number,
  limit: number,
  sort: string
) => {
  return await ProductModel.find()
    .sort({ [sort]: 1 })
    .skip(page * limit)
    .limit(limit)
    .populate(['categoryId', 'imagesId'])
}

const getSingleProduct = async (
  productId: string
): Promise<ProductDocument | null> => {
  return await ProductModel.findOne({
    _id: productId,
  }).populate(['categoryId', 'imagesId'])
}

const getProductByCategoryId = async (categoryId: ObjectId) => {
  return await ProductModel.find({ categoryId: { $in: categoryId } }).populate([
    'categoryId',
    'imagesId',
  ])
}

const insertProduct = async (
  product: ProductDocument
): Promise<ProductDocument> => {
  return await product.save()
}

const updateProduct = async (
  productId: string,
  update: Partial<ProductDocument>
): Promise<ProductDocument | null> => {
  return await ProductModel.findByIdAndUpdate(productId, update, {
    new: true,
  })
}

const deleteProduct = async (
  productId: string
): Promise<ProductDocument | null> => {
  return await ProductModel.findByIdAndDelete(productId)
}

export default {
  getAllProductByPagination,
  getProductByCategoryId,
  getSingleProduct,
  insertProduct,
  updateProduct,
  deleteProduct,
}
