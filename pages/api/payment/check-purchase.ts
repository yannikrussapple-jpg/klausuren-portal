import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from '../../../lib/session'
import dbConnect from '../../../lib/mongodb'
import User from '../../../models/User'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { examId } = req.query

    if (!examId || typeof examId !== 'string') {
      return res.status(400).json({ error: 'Missing examId' })
    }

    // Check if user is logged in
    const session = await getSession(req)
    if (!session?.userId) {
      return res.status(200).json({ purchased: false, requiresAuth: true })
    }

    // Check if user has purchased this exam
    await dbConnect()
    const user = await User.findById(session.userId)
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const purchased = user.purchasedExams?.includes(examId) || false
    res.status(200).json({ purchased, requiresAuth: false })
  } catch (error) {
    console.error('Check purchase error:', error)
    res.status(500).json({ error: 'Failed to check purchase status' })
  }
}
