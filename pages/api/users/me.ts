import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from '../../../lib/session'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = getSession(req)
  if (!session) return res.status(200).json({ user: null })
  return res.status(200).json({ user: session })
}
