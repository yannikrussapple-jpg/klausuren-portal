import type { NextApiRequest, NextApiResponse } from 'next'
import { getExams } from '../../lib/mockdb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { classId, teacherId } = req.query
    const exams = getExams(classId as string, teacherId as string)
    return res.status(200).json(exams)
  }

  res.setHeader('Allow', ['GET'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
