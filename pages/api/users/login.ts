import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from '../../../lib/mongodb'
import User from '../../../models/User'
import { setSession, clearSession } from '../../../lib/session'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { username, password } = req.body || {}

      if (!username || !password) {
        return res.status(400).json({ error: 'username and password required' })
      }

      await connectToDatabase()

      const user = await User.findOne({ username })

      if (!user) {
        return res.status(401).json({ error: 'invalid credentials' })
      }

      const isValid = await bcrypt.compare(password, user.passwordHash)

      if (!isValid) {
        return res.status(401).json({ error: 'invalid credentials' })
      }

      setSession(res, { userId: String(user._id), username: user.username })

      return res.status(200).json({ message: 'login ok', userId: String(user._id) })
    } catch (error) {
      console.error('Login error:', error)
      return res.status(500).json({ error: 'internal server error' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      clearSession(res)
      return res.status(200).json({ ok: true })
    } catch (error) {
      console.error('Logout error:', error)
      return res.status(500).json({ error: 'internal server error' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
