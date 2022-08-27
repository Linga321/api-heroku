import mongoose, { ObjectId, Schema, Document } from 'mongoose'

export interface CartDocument extends Document {
  userId: string
  products: [
    {
      productId: string
      itemQuantity: number
    }
  ]
  status: 'Paid' | 'Pending' | 'Suspend'
  createdAt?: Date
  updatedAt?: Date
}

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
        },
        itemQuantity: {
          type: Number,
        },
      },
    ],
    status: {
      type: String,
      enum: ['Paid', 'Pending', 'Suspend'],
      default:'Pending'
    },
  },
  {
    timestamps: true ,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
)

const Cart = mongoose.model<CartDocument>('Cart', cartSchema)

export default Cart
