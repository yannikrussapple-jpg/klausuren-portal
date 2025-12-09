import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../lib/mongodb'
import ExamModel from '../../models/Exam'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase()

  if (req.method === 'POST') {
    const { examId } = req.body
    if (!examId) return res.status(400).json({ error: 'examId required' })

    // Placeholder: in real app, create Stripe checkout session and wait for webhook.
    // For now, we just mark the exam as paid.
    const exam = await ExamModel.findByIdAndUpdate(examId, { isPaid: true }, { new: true })
    return res.status(200).json({ ok: true, exam })
  }

  res.setHeader('Allow', ['POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
