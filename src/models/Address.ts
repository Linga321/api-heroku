import mongoose, { Schema, Document } from 'mongoose'

export interface AddressDocument extends Document {
  street: string
  postal: string
  city: string
  country: string

}

const addressSchema = new Schema({
  street: { type: String, maxlength: 60, required: true },
  postal: { type: String, maxlength: 100, required: true },
  city: { type: String, maxlength: 100, required: true },
  country: { type: String, maxlength: 100, required: true },
  // status: {type: Bool, default :1} if we suspend the address
})

//Export Address model , addresss will be appear in mogodb
const Address = mongoose.model<AddressDocument>('Address', addressSchema)

export default Address
