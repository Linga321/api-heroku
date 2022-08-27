import { NextFunction, Request, Response } from 'express'
import Review from '../models/Review'

import reviewService from '../services/reviewService'

const getAllReviews = async (req: Request, res: Response, next: NextFunction) => {
  const review = await reviewService.getAllReviews()
  return res.json(review)
}

const getReviewRateByProductId = async (req: Request, res: Response) => {
  const { productId } = req.params
  const review = await reviewService.getReviewRateByProductId(productId)
  return res.json(review)
}

const getReviewByProductId = async (req: Request, res: Response) => {
  const { productId } = req.params
  const review = await reviewService.getReviewByProductId(productId)
  return res.json(review)
}

const getSingleReview = async (req: Request, res: Response) => {
  const { reviewId } = req.params
  const review = await reviewService.getSingleReview(reviewId)
  return res.json(review)
}

const createReview = async (req: Request, res: Response) => {
  const review = req.body
  const reviewCreate = await reviewService.insertReview(new Review(review))
  return res.json(reviewCreate)
}

const updateReview = async (req: Request, res: Response) => {
  const { reviewId } = req.params
  const review = req.body
  const reviewUpdate = await reviewService.updateReview(reviewId,review)
  return res.json(reviewUpdate)
}

const deleteReview = async (req: Request, res: Response) => {
  const { reviewId } = req.params
  const review = await reviewService.deleteReview(reviewId)
  return res.json(review)
}

export default {
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  createReview,
  getReviewByProductId,
  getReviewRateByProductId,
}

