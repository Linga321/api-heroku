import ReviewModel, { ReviewDocument } from '../models/Review'
import { NotFoundError } from '../helpers/apiError'

const getAllReviews = async (): Promise<ReviewDocument[]> => {
  return await ReviewModel.find()
}

const getSingleReview = async (reviewId: string): Promise<ReviewDocument | null> => {
  return await ReviewModel.findById(reviewId)
}

const getReviewByProductId = async (
  productId: string
): Promise<ReviewDocument[]> => {
  return await ReviewModel.find({ productId: productId })
}

const getReviewRateByProductId = async (
  productId: string
) => {
  return await ReviewModel.aggregate([{$match : {productId : productId}},{$group: {_id:null, avg_rate:{$avg:"$rate"}}}])
}

const insertReview = async (review: ReviewDocument) => {
  return await review.save()
}

const updateReview = async (
  reviewId: string,
  update: Partial<ReviewDocument>
) => {
  return await ReviewModel.findByIdAndUpdate(reviewId, update, {
    new: true,
  })
}

const deleteReview = async (reviewId: string) => {
  return await ReviewModel.findByIdAndDelete(reviewId)
}

export default {
  getAllReviews,
  getSingleReview,
  insertReview,
  updateReview,
  deleteReview,
  getReviewByProductId,
  getReviewRateByProductId,
}
