import { Router} from "express";

import { verifyAdmin, verifyUserLogin } from "../middlewares/userMiddlewares";
import imageController from "../controllers/imageController"

const imageRouter = Router()

imageRouter.get('', imageController.getAllCategories )

imageRouter.post('', verifyUserLogin, imageController.createImage )

imageRouter.get('/:imageId', imageController.getSingleImage )

imageRouter.delete('/:imageId', verifyAdmin, imageController.deleteImage )

imageRouter.put('/:imageId', verifyUserLogin,imageController.updateimage )

export default imageRouter