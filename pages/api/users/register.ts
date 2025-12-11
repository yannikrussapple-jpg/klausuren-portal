import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from '../../../lib/mongodb'
import User from '../../../models/User'
import { setSession } from '../../../lib/session'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // POST: Registrierung
  if (req.method === 'POST') {
    try {
      // Debug-Logging
      console.log('=== REGISTER REQUEST ===')
      console.log('req.body:', JSON.stringify(req.body, null, 2))
      
      const { username, password } = req.body || {}
      
      console.log('username:', username)
      console.log('password:', password ? '***' + password.slice(-2) : 'undefined')
      
      // Validierung
      if (!username || !password) {
        console.log('Validation failed: missing username or password')
        return res.status(400).json({ error: 'username and password required' })
      }

      // MongoDB-Verbindung
      await connectToDatabase()
      
      // Prüfen ob Username bereits existiert
      const existingUser = await User.findOne({ username })
      if (existingUser) {
        console.log('User already exists:', username)
        return res.status(409).json({ error: 'User exists' })
      }

      // Passwort hashen
      const passwordHash = await bcrypt.hash(password, 10)

      // Neuen User erstellen
      const createdUser = await User.create({ 
        username, 
        passwordHash 
      })

      // Session setzen
      setSession(res, { userId: String(createdUser._id), username })

      // Erfolgreiche Antwort
      console.log('Registration successful for user:', username)
      return res.status(201).json({ 
        message: 'register ok'
      })
    } catch (error) {
      console.error('=== REGISTER ERROR ===')
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined,
        fullError: error
      })
      return res.status(500).json({ error: 'internal server error' })
    }
  }

  // Andere Methoden nicht erlaubt
  return res.status(405).json({ error: 'Method not allowed' })
}
