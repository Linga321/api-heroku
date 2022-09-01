import { Router} from "express";

import { verifyAdmin, verifyUserLogin } from "../middlewares/userMiddlewares";
import imageController from "../controllers/imageController"
/**
 * @route post-'' if you're a user, posting new image using filename , fileloation
 * @route get-'/:imageId' getting single image using id
 * @route delete-'/:imageId' if you're a admin, deleting single image and all other related data using id, 
 * @route put-'/:imageId' updating single image and using id and filename , fileloation, 
 * @route post'/images' for getting multible images using id
 */
const imageRouter = Router()

imageRouter.post('', verifyUserLogin, imageController.createImage )

imageRouter.get('/:imageId', imageController.getSingleImage )

imageRouter.delete('/:imageId', verifyAdmin, imageController.deleteImage )

imageRouter.put('/:imageId', verifyUserLogin,imageController.updateimage )

imageRouter.post('/images', imageController.getImages )

export default imageRouter