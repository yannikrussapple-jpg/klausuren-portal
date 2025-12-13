import mongoose, { Schema, model, models } from 'mongoose'

export interface IUser {
  username: string
  passwordHash: string
  purchasedExams: string[] // Array of exam IDs that user has purchased
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  purchasedExams: { type: [String], default: [] },
})

export default models.User || model('User', UserSchema)
