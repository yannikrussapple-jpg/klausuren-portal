import mongoose, { Schema, model, models } from 'mongoose'

export interface ITeacher {
  name: string
  classId: mongoose.Types.ObjectId
}

const TeacherSchema = new Schema<ITeacher>({
  name: { type: String, required: true },
  classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
})

export default models.Teacher || model('Teacher', TeacherSchema)
