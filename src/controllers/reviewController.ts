import { NextFunction, Request, Response } from 'express'
import { BadRequestError, NotFoundError } from '../helpers/apiError'
import Review from '../models/Review'

import reviewService from '../services/reviewService'
/**
 * Getting all reviews infomation.
 * Access Level : Admin
 * @param req none, middleware check for user level
 * @param res if reviews is found in reviews, return reviews
 * @param next if review is not found when reviews in empty NotFoundError
 * @returns res
 */
const getAllReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const foundReviews = await reviewService.getAllReviews()
  if (foundReviews) {
    return res.json(foundReviews)
  } else {
    next(new NotFoundError(`Reviews not found`))
  }
}
/**
 * Getting product rating infomation and filtered by productId.
 * Access Level : none
 * @param req none, No middleware check user level
 * @param res if reviews is found in reviews, return rating
 * @param next if review is not found when reviews in empty NotFoundError
 * @returns res
 */
const getReviewRateByProductId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId } = req.params
  const foundRating = await reviewService.getReviewRateByProductId(productId)
  if (foundRating) {
    return res.json(foundRating[0])
  } else {
    next(new NotFoundError(`Reviews not found for prodctId  ${productId}`))
  }
}
/**
 * Getting all reviews infomation filtered by productId.
 * Access Level : none
 * @param req none, No middleware check user level
 * @param res if reviews is found in reviews, return reviews
 * @param next if review is not found when reviews in empty NotFoundError
 * @returns res
 */
const getReviewByProductId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId } = req.params
  const foundReviews = await reviewService.getReviewByProductId(productId)
  if (foundReviews) {
    return res.json(foundReviews)
  } else {
    next(new NotFoundError(`Reviews not found for prodctId  ${productId}`))
  }
}
/**
 * Getting Sigle review infomation using reviewId.
 * Access Level : none
 * @param req @params reviewId
 * @param res if review is found in review, return review
 * @param next if review is not found NotFoundError
 * @returns res
 */
const getSingleReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { reviewId } = req.params
  const foundReview = await reviewService.getSingleReview(reviewId)
  if (foundReview) {
    return res.json(foundReview)
  } else {
    next(new NotFoundError(`Review not found for reviewId ${reviewId}`))
  }
}
/**
 * Create review infomation.
 * Access Level : Admin
 * @param req  @body  userId:- from whom the review made
 *                    productId:- which prodct reviwing
 *                    rate: 1 | 2 | 3 | 4 | 5 rating for the product
 *                    comment: user review about the product
 *                    reviewState?: 'approved' | 'suspend' optional
 * @param res if review is created in review, return review
 * @param next if review is not created BadRequestError
 * @returns res
 */
const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const review = req.body
  const created = await reviewService.insertReview(new Review(review))
  if (created) {
    return res.json(created)
  } else {
    next(new BadRequestError(`Review not created`))
  }
}
/**
 * Updating Sigle review infomation using reviewId.
 * Access Level : Admin/Use
 * @param req   @params reviewId - for finding and updating document
 *              @body userId:- from whom the review made
 *                    productId:- which prodct reviwing
 *                    rate: 1 | 2 | 3 | 4 | 5 rating for the product
 *                    comment: user review about the product
 *                    reviewState?: 'approved' | 'suspend' if you made bad language then suspend comment by the admin
 * @param res if review is updated in review, return review
 * @param next if review is not updated NotFoundError
 * @returns res
 */
const updateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { reviewId } = req.params
  const review = req.body
  const updated = await reviewService.updateReview(reviewId, review)
  if (updated) {
    return res.json(updated)
  } else {
    next(
      new NotFoundError(`Reviews not updated, reviewId not found ${reviewId}`)
    )
  }
}
/**
 * Deleting Sigle review infomation using reviewId.
 * Access Level : Admin
 * @param req   @params reviewId - for finding and deleting document
 * @param res if review is deleted in review, return review
 * @param next if review is not deleted NotFoundError
 * @returns res
 */
const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { reviewId } = req.params
  const deleted = await reviewService.deleteReview(reviewId)
  if (deleted) {
    return res.json(deleted)
  } else {
    next(new NotFoundError(`Reviews not deleted, Id not found ${reviewId}`))
  }
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
