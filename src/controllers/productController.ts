import { NextFunction, Request, Response } from 'express'
import { BadRequestError, NotFoundError } from '../helpers/apiError'
import Product from '../models/Product'

import productService from '../services/productService'
/**
 * Getting all Categories infomation.
 * Access Level : none
 * @param req none, No middleware check product level
 * @param res if categories is found in Categories, return categories
 * @param next if product is not found when categories in empty NotFoundError
 * @returns res
 */
const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const foundProducts = await productService.getAllProduct()
  if (foundProducts) {
    return res.json(foundProducts)
  } else {
    next(new NotFoundError(`Product information not found`))
  }
}
/**
 * Getting Sigle product infomation using productId.
 * Access Level : none
 * @param req @params productId
 * @param res if Categories is found in Categories, return Categories
 * @param next if product is not found NotFoundError
 * @returns res
 */
const getSingleProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId } = req.params
  const foundProducts = await productService.getSingleProduct(productId)
  if (foundProducts) {
    return res.json(foundProducts)
  } else {
    next(new NotFoundError(`Product information not found for ${productId}`))
  }
}
/**
 * Create product infomation.
 * Access Level : Admin
 * @param req  @body    title: strin
 *                      description: string
 *                      discount: number
 *                      price: number
 *                      quantity: number
 *                      categoryId: string[]
 *                      imagesId: string[]
 * @param res if product is created in product, return product
 * @param next if product is not created BadRequestError
 * @returns res
 */
const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { product } = req.body
  const created = await productService.insertProduct(new Product(product))
  if (created) {
    const foundProduct = await productService.getSingleProduct(created._id) // populated data sending back
    return res.json(foundProduct)
  } else {
    return next(new BadRequestError(`product not Saved, Bad data ${product}`))
  }
}
/**
 * Updating Sigle product infomation using productId.
 * Access Level : Admin
 * @param req   @params productId - for finding and updating document
 *              @body   title: strin
 *                      description: string
 *                      discount: number
 *                      price: number
 *                      quantity: number
 *                      categoryId: string[]
 *                      imagesId: string[]
 * @param res if product is updated in product, return product
 * @param next if product is not updated NotFoundError
 * @returns res
 */
const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId } = req.params
  const product = req.body
  const updated = await productService.updateProduct(productId, product)
  if (updated) {
    const foundProduct = await productService.getSingleProduct(updated._id) // populated data sending back
    return res.json(foundProduct)
  } else {
    next(new NotFoundError(`Product information not found`))
  }
}
/**
 * Deleting product infomation using productId.
 * Access Level : Admin
 * @param req   @params productId - for finding and deleting document
 * @param res if product is deleted in product, return product
 * @param next if product is not deleted NotFoundError
 * @returns res
 */
const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId } = req.params
  const deleted = await productService.deleteProduct(productId)
  if (deleted) {
    return res.json(deleted)
  } else {
    next(new NotFoundError(`Product information not found`))
  }
}

export default {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
}
