import { NextFunction, Request, Response } from "express"
import { NotFoundError , BadRequestError } from "../helpers/apiError"
import Category from "../models/Category"
import categoryService from "../services/categoryService"
const getAllCategories = async (req :Request, res: Response, next: NextFunction)=>{
    const categories = await categoryService.getAllCategories()
    if(categories){
        return res.json(categories)
    }else{
        return next(new NotFoundError(`Information might be empty`))
    }
}

const getSingleCategory = async (req :Request, res: Response, next: NextFunction)=>{
    const { categoryId } = req.params
    const category = await categoryService.getSingleCategory(categoryId)
    if(category){
        return res.json(category)
    }else{
        return next(new NotFoundError(`Category Id not found ${categoryId}`))
    }
}

const createCategory = async (req :Request, res: Response, next: NextFunction)=>{
    const  category  = req.body
    const categoryCreate = await categoryService.insertCategory(new Category(category))
    if(categoryCreate){
        return await res.json(categoryService.getSingleCategory(categoryCreate._id)) // populated data sending back
    }else{
        return next(new BadRequestError(`Category not Saved, Bad data ${category}`))
    }
}

const updatecategory = async (req :Request, res: Response, next: NextFunction)=>{
    const { categoryId } = req.params
    const { category } = req.body
    console.log(categoryId, category)
    const categoryUpdate = await categoryService.updateCategory(categoryId, category)
    if(categoryUpdate){
        return res.json(categoryUpdate)
    }else{
        return next(new NotFoundError(`Category not updated, Id not found ${categoryId}`))
    }
    
}

const deleteCategory = async (req :Request, res: Response, next: NextFunction)=>{
    const { categoryId } = req.params
    const category = await categoryService.deleteCategory(categoryId)
    if(category){
        return res.json(category)
    }else{
        return next(new NotFoundError(`Category not deleted, Id not found ${categoryId}`))
    }
}

export default {
    getAllCategories,
    getSingleCategory,
    createCategory,
    updatecategory,
    deleteCategory
}