import { NextApiRequest, NextApiResponse } from 'next'
import { client } from '../../../lib/paypal'
import { getSession } from '../../../lib/session'
import { connectToDatabase } from '../../../lib/mongodb'
import User from '../../../models/User'
const paypal = require('@paypal/checkout-server-sdk')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { orderID, examId } = req.body

    if (!orderID || !examId) {
      return res.status(400).json({ error: 'Missing orderID or examId' })
    }

    // Verify user is logged in
    const session = await getSession(req)
    if (!session?.userId) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    // Capture the payment
    const request = new paypal.orders.OrdersCaptureRequest(orderID)
    request.requestBody({})
    
    const capture = await client().execute(request)

    // Verify payment was successful
    if (capture.result.status === 'COMPLETED') {
      // Add exam to user's purchased exams
      await connectToDatabase()
      await User.findByIdAndUpdate(
        session.userId,
        { $addToSet: { purchasedExams: examId } }
      )

      res.status(200).json({ 
        success: true, 
        captureID: capture.result.id 
      })
    } else {
      res.status(400).json({ error: 'Payment not completed' })
    }
  } catch (error) {
    console.error('PayPal capture error:', error)
    res.status(500).json({ error: 'Failed to capture payment' })
  }
}
