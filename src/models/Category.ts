import mongoose, { Schema, Document } from 'mongoose'

export interface CategoryDocument extends Document {
  name: string
  image: string
}

const categorySchema = new Schema({
  name: { type: String, maxlength: 60, required: true },
  image: { type: Schema.Types.ObjectId, ref: 'Image' },
})

//Export Category model , categorys will be appear in mogodb
const Category = mongoose.model<CategoryDocument>('Category', categorySchema)

export default Category
