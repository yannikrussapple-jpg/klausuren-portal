import mongoose, { Schema, model, models } from 'mongoose'

export interface IExam {
  title: string
  classId: mongoose.Types.ObjectId
  teacherId: mongoose.Types.ObjectId
  number: number
  fileUrl: string
  price: number
  isPaid: boolean
}

const ExamSchema = new Schema<IExam>({
  title: { type: String, required: true },
  classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
  number: { type: Number, default: 1 },
  fileUrl: { type: String, required: true },
  price: { type: Number, default: 0 },
  isPaid: { type: Boolean, default: false },
})

export default models.Exam || model('Exam', ExamSchema)
