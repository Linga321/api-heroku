import { NextFunction, Request, Response } from 'express'
import { BadRequestError } from '../helpers/apiError'
import Product from '../models/Product'

import productService from '../services/productService'

const getAllProducts = async (req: Request, res: Response) => {
  const products = await productService.getAllProduct()
  return res.json(products)
}

const getSingleProduct = async (req: Request, res: Response) => {
  const { productId } = req.params
  const product = await productService.getSingleProduct(productId)
  return res.json(product)
}

const createProduct = async (req: Request, res: Response, next:NextFunction) => {
  const product = req.body
  const productCreated = await productService.insertProduct(new Product(product?.product))
  if(productCreated){
      return await res.json(productService.getSingleProduct(productCreated._id)) // populated data sending back
  }else{
      return next(new BadRequestError(`Category not Saved, Bad data ${product}`))
  }
}

const updateProduct = async (req: Request, res: Response) => {
  const { productId } = req.params
  const product = req.body
  const productUpdate = await productService.updateProduct(productId,product)
  return res.json(productUpdate)
}

const deleteProduct = async (req: Request, res: Response) => {
  const { productId } = req.params
  const product = await productService.deleteProduct(productId)
  return res.json(product)
}

export default {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
}
