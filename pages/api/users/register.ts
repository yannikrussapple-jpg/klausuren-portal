import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from '../../../lib/mongodb'
import User from '../../../models/User'
import { setSession } from '../../../lib/session'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { username, password } = req.body || {}
  if (!username || !password) return res.status(400).json({ error: 'username and password required' })
  await connectToDatabase()
  const existing = await User.findOne({ username })
  if (existing) return res.status(409).json({ error: 'username already exists' })
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ username, passwordHash })
  setSession(res, { userId: String(user._id), username })
  return res.status(201).json({ _id: user._id, username })
}
