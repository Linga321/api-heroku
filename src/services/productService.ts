import ProductModel, { ProductDocument } from '../models/Product'
import { NotFoundError } from '../helpers/apiError'
import { ObjectId } from 'mongoose'

const getAllProductPaginationPipline = async (
  page: number,
  limit: number,
  sort: string
) => {
  return await ProductModel.aggregate()
    .sort({ [sort]: 1 })
    .skip(page * limit)
    .limit(limit)
    .lookup({
      from: 'categories',
      localField: 'categoryId',
      foreignField: '_id',
      as: 'categories',
    })
    .lookup({
      from: 'images',
      localField: 'imagesId',
      foreignField: '_id',
      as: 'images',
    })
}

const getAllProductPipline = async () => {
  return await ProductModel.aggregate()
    .lookup({
      from: 'categories',
      localField: 'categoryId',
      foreignField: '_id',
      as: 'categories',
    })
    .lookup({
      from: 'images',
      localField: 'imagesId',
      foreignField: '_id',
      as: 'images',
    })
  
}

const getAllProduct = async (): Promise<ProductDocument[]> => {
  return await ProductModel.find().populate(['categoryId', 'imagesId']) //{status:1}
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
  console.log(product)
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
  getAllProductPaginationPipline,
  getProductByCategoryId,
  getAllProductPipline,
  getAllProduct,
  getSingleProduct,
  insertProduct,
  updateProduct,
  deleteProduct,
}
