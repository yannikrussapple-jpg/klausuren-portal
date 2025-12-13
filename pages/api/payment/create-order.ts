import { NextApiRequest, NextApiResponse } from 'next'
import { client } from '../../../lib/paypal'
const paypal = require('@paypal/checkout-server-sdk')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { examId, examTitle, price } = req.body

    if (!examId || !examTitle || !price) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const request = new paypal.orders.OrdersCreateRequest()
    request.prefer('return=representation')
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: examId,
        description: `Klausur: ${examTitle}`,
        amount: {
          currency_code: 'EUR',
          value: price.toFixed(2)
        }
      }]
    })

    const order = await client().execute(request)
    res.status(200).json({ orderID: order.result.id })
  } catch (error) {
    console.error('PayPal order creation error:', error)
    res.status(500).json({ error: 'Failed to create order' })
  }
}
