import { Router} from "express";

import productController from "../controllers/productController"
import {verifyAdmin} from '../middlewares/userMiddlewares'

const productRouter = Router()

productRouter.get('', productController.getAllProducts )

productRouter.post('', verifyAdmin, productController.createProduct )

productRouter.get('/:productId', productController.getSingleProduct )

productRouter.put('/:productId', verifyAdmin, productController.updateProduct )

productRouter.delete('/:productId', verifyAdmin, productController.deleteProduct )

export default productRouter