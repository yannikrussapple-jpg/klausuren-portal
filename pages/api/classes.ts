import type { NextApiRequest, NextApiResponse } from 'next'
import { getClasses } from '../../lib/mockdb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const classes = getClasses()
    return res.status(200).json(classes)
  }

  res.setHeader('Allow', ['GET'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
