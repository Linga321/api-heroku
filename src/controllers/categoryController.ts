import { NextFunction, Request, Response } from 'express'

import { NotFoundError, BadRequestError } from '../helpers/apiError'
import Category from '../models/Category'
import categoryService from '../services/categoryService'

/**
 * Getting all Categories infomation.
 * Access Level : none
 * @param req none, No middleware check category level
 * @param res if categories is found in Categories, return categories
 * @param next if Category is not found when categories in empty NotFoundError
 * @returns res
 */
const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const categories = await categoryService.getAllCategories()
  if (categories) {
    return res.json(categories)
  } else {
    return next(new NotFoundError('Information might be empty'))
  }
}
/**
 * Getting Sigle Category infomation using CategoryId.
 * Access Level : none
 * @param req @params categoryId
 * @param res if Categories is found in Categories, return Categories
 * @param next if Category is not found NotFoundError
 * @returns res
 */
const getSingleCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { categoryId } = req.params
  const foundCategory = await categoryService.getSingleCategory(categoryId)
  if (foundCategory) {
    return res.json(foundCategory)
  } else {
    return next(new NotFoundError(`Category Id not found ${categoryId}`))
  }
}
/**
 * Create Category infomation.
 * Access Level : Admin
 * @param req  @body name    - Category Name
 *                   imageId - imageId that stored in Images Data
 * @param res if category is created in category, return category
 * @param next if Category is not created BadRequestError
 * @returns res
 */
const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { category } = req.body
  const created = await categoryService.insertCategory(new Category(category))
  if (created) {
    const foundCategory = await categoryService.getSingleCategory(created._id)
    return await res.json(foundCategory) // populated data sending back
  } else {
    return next(new BadRequestError(`Category not Saved, Bad data ${category}`))
  }
}
/**
 * Updating Sigle Category infomation using CategoryId.
 * Access Level : Admin
 * @param req   @params CategoryId - for finding and updating document
 *              @body name    - Category Name
 *                    imageId - imageId that stored in Images Data
 * @param res if category is updated in category, return category
 * @param next if Category is not updated NotFoundError
 * @returns res
 */
const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { categoryId } = req.params
  const { category } = req.body
  const updated = await categoryService.updateCategory(categoryId, category)
  if (updated) {
    return res.json(updated)
  } else {
    return next(
      new NotFoundError(`Category not updated, Id not found ${categoryId}`)
    )
  }
}
/**
 * Deleting Sigle Category infomation using CategoryId.
 * Access Level : Admin
 * @param req   @params CategoryId - for finding and deleting document
 * @param res if category is deleted in category, return category
 * @param next if Category is not deleted NotFoundError
 * @returns res
 */
const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { categoryId } = req.params
  const deleted = await categoryService.deleteCategory(categoryId)
  if (deleted) {
    return res.json(deleted)
  } else {
    return next(
      new NotFoundError(`Category not deleted, Id not found ${categoryId}`)
    )
  }
}

export default {
  getAllCategories,
  getSingleCategory,
  createCategory,
  updateCategory,
  deleteCategory,
}
