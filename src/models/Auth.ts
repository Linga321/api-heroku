import mongoose, { ObjectId, Schema, Document } from 'mongoose'

export interface AuthDocument extends Document {
  userId: string | object
  token: string
  status: 'Login' | 'Logout'
}

const authSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    token: { type: String, maxlength: 200, required: true },
    status: {
      type: String,
      enum: ['Login', 'Logout'],
      default: 'Login',
    },
  },
  { timestamps: true }
)
authSchema.virtual('userlogin', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  select: {
    _id: 1,
    firstName: 1,
    lastName: 1,
    email: 1,
    role: 1,
    avatar: 1,
    phone: 1,
  },
})

const Auth = mongoose.model<AuthDocument>('Auth', authSchema)

export default Auth
