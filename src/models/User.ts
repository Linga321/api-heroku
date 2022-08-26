import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import { NotFoundError } from '../helpers/apiError'

export type UserRole = 'Customer' | 'Admin' | 'SuperAdmin'
export interface UserDocument extends Document {
  firstName: string
  lastName: string
  email: string
  password: string
  role?: UserRole
  avatar?: string
  phone?: string
  address?: 
    {
      user_address: string
      place: string
    }[]
  comparePassword(password: string): Promise<boolean>
}

const userSchema = new Schema<UserDocument>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v: string) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v)
        },
        message: ({ value }: { value: string }) =>
          `${value} is not a valid email format!`,
      },
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['Customer', 'Admin', 'SuperAdmin'],
      default:'Customer'
    },
    avatar: { type: Schema.Types.ObjectId, ref: 'Image' },
    phone: {
      type: String,
      minLength: 10,
      maxLength: 12,
    },
    address: [
      {
        user_address: {
          type: Schema.Types.ObjectId,
          ref: 'Address',
        },
        place: { type: String },
      },
    ],
    // status: {type: Bool, default :1} if we suspend the user
  },
  { timestamps: true }
)

userSchema.pre<UserDocument>('save', async function (next) {
  try {
    if (this.isModified('password') || this.isNew) {
      this.password = await bcrypt.hash(this.password, 10)
      return next()
    }
  } catch (e) {
    return next(new NotFoundError('Password Not match'))
  }
})

userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password)
}

const User = mongoose.model<UserDocument>('User', userSchema)

export default User
