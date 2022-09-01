import ReviewModel, { ReviewDocument } from '../models/Review'

const getAllReviews = async (): Promise<ReviewDocument[]> => {
  return await ReviewModel.find()
}

const getSingleReview = async (
  reviewId: string
): Promise<ReviewDocument | null> => {
  return await ReviewModel.findById(reviewId)
}

const getReviewByProductId = async (
  productId: string
): Promise<ReviewDocument[]> => {
  return await ReviewModel.find({ productId: productId }).populate({
    path: 'userId',
    model: 'User',
    select: { firstName: 1, lastName: 1, avatar: 1 },
    populate: [
      {
        path: 'avatar',
        model: 'Image',
      },
    ],
  })
}

const getReviewRateByProductId = async (productId: string) => {
  const ObjectId = require('mongoose').Types.ObjectId
  return await ReviewModel.aggregate([
    { $match: { productId: ObjectId(productId) } },
    { $group: { _id: 0, avgRate: { $avg: '$rate' } } },
  ])
}

const insertReview = async (review: ReviewDocument) => {
  return await ReviewModel.create(review)
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
