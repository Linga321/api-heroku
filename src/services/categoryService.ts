import CategoryModel, { CategoryDocument } from '../models/Category'
import { NotFoundError } from '../helpers/apiError'

const getAllCategories = async (): Promise<CategoryDocument[]> => {
  return await CategoryModel.find().populate('image')
}

const getSingleCategory = async (
  categoryId: string
): Promise<CategoryDocument | null> => {
  return await CategoryModel.findById(categoryId).populate('image')
}

const insertCategory = async (category: CategoryDocument) => {
  return await category.save()
}

const updateCategory = async (
  categoryId: string,
  update: Partial<CategoryDocument>
) => {
  return await CategoryModel.findByIdAndUpdate(categoryId,update,{new: true,}).populate('image')
}

const deleteCategory = async (categoryId: string) => {
  return CategoryModel.findByIdAndDelete(categoryId)
}

export default {
  getAllCategories,
  getSingleCategory,
  insertCategory,
  updateCategory,
  deleteCategory,
}
