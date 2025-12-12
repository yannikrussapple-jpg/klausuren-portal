import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from '../../../lib/mongodb'
import User from '../../../models/User'
import { setSession } from '../../../lib/session'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { username, password } = req.body || {}

    if (!username || !password) {
      return res.status(400).json({ error: 'username and password required' })
    }

    console.log('Connecting to database...')
    await connectToDatabase()
    console.log('Database connected, checking for existing user...')

    const existingUser = await User.findOne({ username })

    if (existingUser) {
      return res.status(409).json({ error: 'User exists' })
    }

    console.log('Creating new user...')
    const passwordHash = await bcrypt.hash(password, 10)

    const newUser = await User.create({ username, passwordHash })
    console.log('User created successfully:', newUser._id)

    setSession(res, { userId: String(newUser._id), username: newUser.username })

    return res.status(201).json({ message: 'register ok', userId: String(newUser._id) })
  } catch (error: any) {
    console.error('Register error:', error)
    console.error('Error name:', error?.name)
    console.error('Error message:', error?.message)
    console.error('Error stack:', error?.stack)
    return res.status(500).json({ error: 'internal server error', details: error?.message })
  }
}
