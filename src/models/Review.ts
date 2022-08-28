import mongoose, { Document, ObjectId, Schema } from 'mongoose'

export interface ReviewDocument extends Document {
  userId: ObjectId | string
  productId: ObjectId | string
  rate: 1 | 2 | 3 | 4 | 5
  comment: string
  reviewState?: 'approved' | 'suspend'
}

const ReviewSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    rate: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      required: true,
      default: 3,
    },
    comment: {
      type: String,
    },
    reviewState: {
      type: String,
      enum: ['approved', 'suspend'],
      default: 'approved',
    },
  },
  { timestamps: true }
)

const Review = mongoose.model<ReviewDocument>('Review', ReviewSchema)
export default Review
