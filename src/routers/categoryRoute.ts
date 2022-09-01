import { Router } from "express";

import { verifyAdmin } from "../middlewares/userMiddlewares";
import categoryController from "../controllers/categoryController"
/**
 * @route get-'' getting every categories and all other related data, 
 * @route post-'' if you're a admin, creating new category using name ,imageId,
 * @route get-'/:categoryId' if you're a admin getting single category using categoryId
 * @route delete-'/:categoryId' if you're a admin, deleting single category and all other related data using categoryId, 
 * @route put-'/:categoryId' updating single category and using categoryId and name , imageId,
 */
const categoryRouter = Router()

categoryRouter.get('', categoryController.getAllCategories )

categoryRouter.post('', verifyAdmin, categoryController.createCategory )

categoryRouter.get('/:categoryId', categoryController.getSingleCategory )

categoryRouter.delete('/:categoryId', verifyAdmin, categoryController.deleteCategory )

categoryRouter.put('/:categoryId', verifyAdmin,categoryController.updateCategory )

export default categoryRouter