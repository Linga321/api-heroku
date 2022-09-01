import ImageModel, { ImageDocument } from '../models/Image'
import Product from '../models/Product'
import Category from '../models/Category'

const getImages = async (imagesId : string[]): Promise<ImageDocument[]> => {
  return await ImageModel.find({_id : {$in : imagesId}})
}

const getSingleImage = async (
  imageId: string
): Promise<ImageDocument | null> => {
  return await ImageModel.findById(imageId)
}

const insertImage = async (image: ImageDocument) => {
  return await image.save()
}

const updateImage = async (imageId: string, update: Partial<ImageDocument>) => {
  return await ImageModel.findByIdAndUpdate(imageId, update, { new: true })
}

const deleteImage = async (imageId: string) => {
  await Product.update(
    {
      imagesId: imageId,
    },
    {
      $pull: {
        imagesId: imageId,
      },
    }
  )
  await Category.update(
    {
      image: imageId,
    },
    {
      $pull: {
        image: imageId,
      },
    }
  )
  return await ImageModel.findByIdAndDelete(imageId)
}

export default {
  getImages,
  getSingleImage,
  insertImage,
  updateImage,
  deleteImage,
}
