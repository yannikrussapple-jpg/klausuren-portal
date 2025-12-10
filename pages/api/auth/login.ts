import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Auth removed for dev: return 404 to indicate endpoint is disabled
  return res.status(404).json({ error: 'Auth disabled in this build' })
}
