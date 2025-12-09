import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const { password } = req.body
  const correctPassword = process.env.PORTAL_PASSWORD || 'admin123'

  if (password === correctPassword) {
    // Generate a simple token (in production, use JWT)
    const token = Buffer.from(password + Date.now()).toString('base64')
    return res.status(200).json({ token })
  }

  return res.status(401).json({ error: 'Invalid password' })
}
