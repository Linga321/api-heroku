import { Router} from "express";

import productController from "../controllers/productController"
import reviewController from "../controllers/reviewController";
import {verifyAdmin, verifyUserLogin} from '../middlewares/userMiddlewares'

const productRouter = Router()

productRouter.get('', productController.getAllProducts )

productRouter.post('', verifyAdmin, productController.createProduct )

productRouter.get('/:productId', productController.getSingleProduct )

productRouter.put('/:productId', verifyAdmin, productController.updateProduct )

productRouter.delete('/:productId', verifyAdmin, productController.deleteProduct )

productRouter.get('/review', reviewController.getAllReviews )

productRouter.post('/review', verifyUserLogin, reviewController.createReview )

productRouter.get('/:productId/review', reviewController.getReviewByProductId )

productRouter.get('/:productId/review/rate', reviewController.getReviewRateByProductId )

productRouter.put('/review/reviewId', verifyUserLogin, reviewController.updateReview )

productRouter.delete('/review/reviewId', verifyAdmin, reviewController.deleteReview )

export default productRouter