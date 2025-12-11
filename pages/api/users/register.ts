import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from '../../../lib/mongodb'
import User from '../../../models/User'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Nur POST erlauben
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Body-Parameter validieren
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ 
        error: 'username and password required' 
      })
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid input format' 
      })
    }

    if (username.length < 3 || password.length < 4) {
      return res.status(400).json({ 
        error: 'Username must be at least 3 characters, password at least 4' 
      })
    }

    // Mit MongoDB verbinden
    await connectToDatabase()

    // Prüfen ob Benutzer bereits existiert
    const existingUser = await User.findOne({ username: username.toLowerCase() })
    
    if (existingUser) {
      return res.status(409).json({ 
        error: 'User exists' 
      })
    }

    // Passwort hashen (Salt rounds: 10)
    const hashedPassword = await bcrypt.hash(password, 10)

    // Neuen Benutzer erstellen und speichern
    const newUser = new User({
      username: username.toLowerCase(),
      passwordHash: hashedPassword
    })

    await newUser.save()

    // Erfolgreiche Registrierung
    return res.status(200).json({
      message: 'register ok',
      userId: newUser._id.toString()
    })

  } catch (error: any) {
    // Detailliertes Error-Logging für Debugging
    console.error('Registration error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })

    // MongoDB-Duplikat-Fehler abfangen
    if (error.code === 11000) {
      return res.status(409).json({ 
        error: 'User exists' 
      })
    }

    // Generischer Serverfehler
    return res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}
