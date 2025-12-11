import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from '../../../lib/mongodb'
import User from '../../../models/User'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // POST: Registrierung
  if (req.method === 'POST') {
    try {
      const { username, password } = req.body || {}
      
      // Validierung
      if (!username || !password) {
        return res.status(400).json({ error: 'username and password required' })
      }

      // MongoDB-Verbindung
      await connectToDatabase()
      
      // Prüfen ob Username bereits existiert
      const existingUser = await User.findOne({ username })
      if (existingUser) {
        return res.status(409).json({ error: 'User exists' })
      }

      // Passwort hashen
      const hashedPassword = await bcrypt.hash(password, 10)

      // Neuen User erstellen
      const newUser = new User({ 
        username, 
        passwordHash: hashedPassword 
      })
      await newUser.save()

      // Erfolgreiche Antwort
      return res.status(200).json({ 
        message: 'register ok', 
        userId: newUser._id 
      })
    } catch (error) {
      console.error('Register error:', error)
      return res.status(500).json({ error: 'internal server error' })
    }
  }

  // Andere Methoden nicht erlaubt
  return res.status(405).json({ error: 'Method not allowed' })
}
