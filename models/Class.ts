import mongoose, { Schema, model, models } from 'mongoose'

export interface IClass {
  name: string
}

const ClassSchema = new Schema<IClass>({
  name: { type: String, required: true },
})

export default models.Class || model('Class', ClassSchema)
