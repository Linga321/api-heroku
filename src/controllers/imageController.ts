import { NextFunction, Request, Response } from 'express'
import path from 'path'
import { unlinkSync } from 'fs'

import { UploadedFile } from 'express-fileupload'
import Image, { ImageDocument } from '../models/Image'
import imageService from '../services/imageService'
import stringGenerator from '../util/randomString'
import { NotFoundError } from '../helpers/apiError'
import { BASE_URL } from '../util/secrets'
/**
 * Getting all images infomation and filtered by imagesId(:string[]) done in this function.
 * Access Level : none
 * @param req @body imagesId: string[]
 * @param res if images is found in with ImagesId, return images
 * @param next if images is not found when images in empty NotFoundError
 * @returns res
 */
const getImages = async (req: Request, res: Response, next: NextFunction) => {
  const { imagesId } = req.body
  const foundImages = await imageService.getImages(imagesId as string[])
  if (foundImages) {
    return res.json(foundImages)
  } else {
    next(new NotFoundError('Imges not found'))
  }
}
/**
 * Getting Sigle images infomation using imageId done in this function.
 * Access Level : none
 * @param req @params imageId
 * @param res if image is found in image, return image file
 * @param next if image is not found NotFoundError
 * @returns res
 */
const getSingleImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { imageId } = req.params
  const options = {
    root: path.join(__dirname) + '../uploads',
  }
  const fileName = (await imageService.getSingleImage(imageId))?.filelocation

  if (fileName) {
    res.sendFile(fileName, options, function (err) {
      if (err) {
        next(new NotFoundError('Imge not found'))
      } else {
        next()
      }
    })
  } else {
    return res.status(404).send('Not found')
  }
}
/**
 * Create image infomation done in this function.
 * Check allowedExtension .png', '.jpg', '.jpeg'
 * Move the newFile to uploads folder that located in 'imageDirPath' with new filename(newRandFileName)
 * imageFinalResult for getting create or update the image result
 * - it will prevent multible file uploaded into server,
 *   - when user modify the profile image it will delete old file, and create new image file
 *     and update with new image filelocation and filename(newRandFileName) in Images Data
 * Access Level : User/Admin
 * @param req  @body -imageId - if imageId found then delete the image file in uploads and replace new file
 *             @files -image  - if storeing the image file in uploads folder
 * @param res if image is created in Images, return image
 * @param next if image is not created InternalServerError
 *             if files is not found InternalServerError
 * @returns res
 */
const createImage = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.files) {
    next(new NotFoundError('Image File not Uploaded'))
  } else {
    let imageFinalResult
    const newFile = req.files.image as UploadedFile
    const allowedExtension = ['.png', '.jpg', '.jpeg']
    const extensionName = path.extname(newFile.name) // fetch the file extension
    const imageDirPath = path.resolve(__dirname, '../uploads')
    const newRandFileName =
      new Date().getTime() + stringGenerator.fileNameGenerator()

    if (!allowedExtension.includes(extensionName)) {
      next(new NotFoundError(`Invalid Image, only allowed ${allowedExtension}`))
    } else {
      await newFile.mv(
        path.resolve(imageDirPath, newRandFileName + '_' + newFile.name)
      )
      const imageObject = {
        filename: newRandFileName + '_' + newFile.name,
        filelocation: BASE_URL + '/' + newRandFileName + '_' + newFile.name,
      }
      if (req.body?.imageId) {
        const foundFile = await imageService.getSingleImage(req.body?.imageId)
        if (foundFile) {
          await unlinkSync(imageDirPath + `/${foundFile?.filename}`)
          imageFinalResult = await imageService.updateImage(
            req.body?.imageId,
            imageObject as Partial<ImageDocument>
          )
        }
      } else {
        imageFinalResult = await imageService.insertImage(
          new Image(imageObject)
        )
      }
      res.json(imageFinalResult ? imageFinalResult : { _id: req.body?.imageId })
    }
  }
}
/**
 * Updating Sigle image infomation using imagesId done in this function.
 * Access Level : Admin/User
 * @param req   @params imagesId - for finding and updating document
 *              @body image - filename and filelocation that update in Images Data
 * @param res if image is updated in image, return image
 * @param next if images is not updated InternalServerError
 * @returns res
 */
const updateimage = async (req: Request, res: Response) => {
  const { imageId } = req.params
  const { image } = req.body
  const imageUpdate = await imageService.updateImage(imageId, image)
  return res.json(imageUpdate)
}
/**
 * Deleteing image using imagesId done in this function.
 * Access Level : Admin/User
 * @param req   @params imagesId - for finding and deleting document
 * @param res if image is updated in image, return image
 * @param next if images is not updated InternalServerError
 * @returns res
 */
const deleteImage = async (req: Request, res: Response) => {
  const imageDirPath = path.resolve(__dirname, '../uploads')
  const { imageId } = req.params
  const image = await imageService.deleteImage(imageId)
  if (image) {
    await unlinkSync(imageDirPath + `/${image?.filename}`)
  }
  return res.json(image)
}

export default {
  getImages,
  getSingleImage,
  createImage,
  updateimage,
  deleteImage,
}
