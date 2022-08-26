import mongoose, { ObjectId, Schema, Document } from 'mongoose'

export interface ProductDocument extends Document {
  title: string
  description: string
  discount: number
  price: number
  quantity: number
  categoryId: string[]
  imagesId: string[]
}

const productSchema = new Schema(
  {
    title: { type: String, maxlength: 100, required: true },
    description: { type: String, maxlength: 200 },
    discount: { type: Number, min: 0, max: 100 },
    price: { type: Number, min: 0, max: 1000 },
    quantity: { type: Number, min: 0, max: 1000},
    categoryId: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    imagesId: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
    // status: {type: Bool, default :1} if we suspend the product
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
)

productSchema.virtual('categories', {
  ref: 'categories',
  localField: 'categoryId',
  foreignField: '_id',
})

productSchema.virtual('uploads', {
  ref: 'uploads',
  localField: 'imagesId',
  foreignField: '_id',
})

//Export Product model , products will be appear in mogodb

const Product = mongoose.model<ProductDocument>('Product', productSchema)

export default Product
