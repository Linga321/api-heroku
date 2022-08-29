import { NextFunction, Request, Response } from 'express'
import path from 'path'
import { unlinkSync } from 'fs'

import { UploadedFile } from 'express-fileupload'
import Image, { ImageDocument } from '../models/Image'
import imageService from '../services/imageService'
import stringGenerator from '../util/randomString'
import { NotFoundError } from '../helpers/apiError'

const getAllCategories = async (req: Request, res: Response) => {
  const categories = await imageService.getAllCategories()
  return res.json(categories)
}

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

const createImage = async (req: Request, res: Response) => {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.')
  } else {
    let imageCreate
    const file = req.files.image as UploadedFile
    const allowedExtension = ['.png', '.jpg', '.jpeg']
    const extensionName = path.extname(file.name) // fetch the file extension
    const imageDirPath = path.resolve(__dirname, '../uploads')
    const newfilename =
      new Date().getTime() + stringGenerator.fileNameGenerator()

    if (!allowedExtension.includes(extensionName)) {
      return res.status(422).send('Invalid Image')
    } else {
      await file.mv(path.resolve(imageDirPath, newfilename + '_' + file.name))
      const url = process.env['BASE_URL']
      const image = {
        filename: newfilename + '_' + file.name,
        filelocation: url + newfilename + '_' + file.name,
      }
      const newimage = new Image(image)
      if (req.body?.imageId) {
        await unlinkSync(imageDirPath + `/${req.body?.fileName}`)
        imageCreate = await imageService.updateImage(
          req.body?.imageId,
          image as Partial<ImageDocument>
        )
      } else {
        imageCreate = await imageService.insertImage(newimage)
      }
      res.json(imageCreate ? imageCreate : { _id: req.body?.imageId })
    }
  }
}

const updateimage = async (req: Request, res: Response) => {
  const { imageId } = req.params
  const { image } = req.body
  const imageUpdate = await imageService.updateImage(imageId, image)
  return res.json(imageUpdate)
}

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
  getAllCategories,
  getSingleImage,
  createImage,
  updateimage,
  deleteImage,
}
