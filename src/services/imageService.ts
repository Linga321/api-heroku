import ImageModel, { ImageDocument } from '../models/Image'
import { NotFoundError } from '../helpers/apiError'

const getAllCategories = async (): Promise<ImageDocument[]> => {
  return await ImageModel.find()
}

const getSingleImage = async (
  imageId: string
): Promise<ImageDocument | null> => {
  return await ImageModel.findById(imageId)
}

const insertImage = async (image: ImageDocument) => {
  return await image.save()
}

const updateImage = async (
  imageId: string,
  update: Partial<ImageDocument>
) => {
  return await ImageModel.findByIdAndUpdate(imageId,update,{new: true,})
}

const deleteImage = async (imageId: string) => {
  return ImageModel.findByIdAndDelete(imageId)
}

export default {
  getAllCategories,
  getSingleImage,
  insertImage,
  updateImage,
  deleteImage,
}
