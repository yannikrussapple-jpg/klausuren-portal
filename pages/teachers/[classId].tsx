import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import axios from 'axios'
import Link from 'next/link'

export default function TeachersByClass() {
  const router = useRouter()
  const { classId } = router.query
  const [teachers, setTeachers] = useState<any[]>([])

  useEffect(() => {
    if (!classId) return
    axios.get('/api/teachers', { params: { classId } }).then(r => setTeachers(r.data))
  }, [classId])

  return (
    <Layout>
      <h2 className="text-xl mb-4">Lehrer</h2>
      <div className="space-y-2">
        {teachers.map(t => (
          <div key={t._id} className="p-3 bg-white border rounded">
            <div className="flex justify-between items-center">
              <div>{t.name}</div>
              <Link href={`/exams?teacherId=${t._id}&classId=${classId}`} className="text-blue-600">Klausuren</Link>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}
