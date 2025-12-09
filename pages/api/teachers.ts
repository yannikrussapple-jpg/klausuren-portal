import type { NextApiRequest, NextApiResponse } from 'next'
import { getTeachers } from '../../lib/mockdb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { classId } = req.query
    const teachers = getTeachers(classId as string)
    return res.status(200).json(teachers)
  }

  res.setHeader('Allow', ['GET'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
