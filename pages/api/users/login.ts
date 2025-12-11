import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from '../../../lib/mongodb'
import User from '../../../models/User'
import { setSession, clearSession } from '../../../lib/session'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // POST: Login
  if (req.method === 'POST') {
    try {
      // Debug-Logging
      console.log('=== LOGIN REQUEST ===')
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
      
      // Benutzer suchen
      const user = await User.findOne({ username })
      if (!user) {
        return res.status(401).json({ error: 'invalid credentials' })
      }

      // Passwort vergleichen
      const passwordMatch = await bcrypt.compare(password, user.passwordHash)
      if (!passwordMatch) {
        return res.status(401).json({ error: 'invalid credentials' })
      }

      // Session-Cookie setzen
      setSession(res, { userId: String(user._id), username: user.username })

      // Erfolgreiche Antwort
      console.log('Login successful for user:', username)
      return res.status(200).json({ 
        message: 'login ok', 
        userId: user._id,
        username: user.username 
      })
    } catch (error) {
      console.error('=== LOGIN ERROR ===')
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined,
        fullError: error
      })
      return res.status(500).json({ error: 'internal server error' })
    }
  }

  // DELETE: Logout
  if (req.method === 'DELETE') {
    try {
      clearSession(res)
      return res.status(200).json({ ok: true })
    } catch (error) {
      console.error('Logout error:', error)
      return res.status(500).json({ error: 'internal server error' })
    }
  }

  // Andere Methoden nicht erlaubt
  return res.status(405).json({ error: 'Method not allowed' })
}
