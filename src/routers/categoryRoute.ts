import { Router, Request, Response, NextFunction, response } from "express";

import { verifyAdmin } from "../middlewares/userMiddlewares";
import categoryController from "../controllers/categoryController"

const categoryRouter = Router()

categoryRouter.get('', categoryController.getAllCategories )

categoryRouter.post('', verifyAdmin, categoryController.createCategory )

categoryRouter.get('/:categoryId', categoryController.getSingleCategory )

categoryRouter.delete('/:categoryId', verifyAdmin, categoryController.deleteCategory )

categoryRouter.put('/:categoryId', verifyAdmin,categoryController.updatecategory )

export default categoryRouter