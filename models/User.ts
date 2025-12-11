import mongoose, { Schema, model, models } from 'mongoose'

export interface IUser {
  username: string
  passwordHash: string
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
})

export default models.User || model('User', UserSchema)
