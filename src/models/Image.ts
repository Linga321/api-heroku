import mongoose, { Document, ObjectId, Schema } from 'mongoose'

export interface ImageDocument extends Document {
  filename: string
  filelocation: string
}

const uploadSchema = new Schema({
  filename: {
    type: String,
    maxlength: 150,
    required: true,
  },
  filelocation: {
    type: String,
    maxlength: 250,
    required: true,
  },
})

const Image = mongoose.model<ImageDocument>('Image', uploadSchema)
export default Image
