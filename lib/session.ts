import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'

const SESSION_COOKIE = 'session'
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

export function setSession(res: NextApiResponse, payload: { userId: string; username: string }) {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${7 * 24 * 3600}`)
}

export function clearSession(res: NextApiResponse) {
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`)
}

export function getSession(req: NextApiRequest): { userId: string; username: string } | null {
  const cookie = req.headers.cookie || ''
  const match = cookie.split(';').map(c => c.trim()).find(c => c.startsWith(`${SESSION_COOKIE}=`))
  if (!match) return null
  const token = match.split('=')[1]
  try {
    return jwt.verify(token, JWT_SECRET) as any
  } catch {
    return null
  }
}
