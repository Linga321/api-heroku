import { Router} from "express";

import productController from "../controllers/productController"
import reviewController from "../controllers/reviewController";
import {verifyAdmin, verifyUserLogin} from '../middlewares/userMiddlewares'
/**
 * @route get-'' getting every products and all other related data, 
 * @route post-'' if you're a admin, creating new product using title,description,discount,price,quantity,categoryId,imagesId
 * @route get-'/:productId' if you're a admin getting single product using productId
 * @route put-'/:productId' update single product and using productId and title,description,discount,price,quantity,categoryId,imagesId,
 * @route delete-'/:productId' if you're a admin, deleting single product and all other related data using productId, 
 * @route get-'review' if your a admin, getting every all product review and all other related data, 
 * @route post-'review' if you're a user, creating new product review using rating, comment
 * @route get-'/:productId/review/' getting single product review using productId
 * @route put-'/review/reviewId' if you're a user, update single product review and using reviewId and rating, comment
 * @route delete-'/review/reviewId' if you're a admin, deleting single product review and all other related data using reviewId, 
 */
 
const productRouter = Router()

productRouter.get('/:page/:limit/:sort', productController.getAllProducts )

productRouter.post('', verifyAdmin, productController.createProduct )

productRouter.get('/:productId', productController.getSingleProduct )

productRouter.put('/:productId', verifyAdmin, productController.updateProduct )

productRouter.delete('/:productId', verifyAdmin, productController.deleteProduct )

productRouter.get('/review',verifyAdmin,  reviewController.getAllReviews )

productRouter.post('/review', verifyUserLogin, reviewController.createReview )

productRouter.get('/:productId/review', reviewController.getReviewByProductId )

productRouter.get('/:productId/review/rate', reviewController.getReviewRateByProductId )

productRouter.put('/review/reviewId', verifyUserLogin, reviewController.updateReview )

productRouter.delete('/review/reviewId', verifyAdmin, reviewController.deleteReview )

export default productRouter