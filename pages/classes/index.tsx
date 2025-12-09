import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import axios from 'axios'
import Link from 'next/link'

export default function ClassesPage() {
  const [classes, setClasses] = useState<any[]>([])

  useEffect(() => {
    axios.get('/api/classes').then(r => setClasses(r.data))
  }, [])

  return (
    <Layout>
      <h2 className="text-xl mb-4">Klassen</h2>
      <div className="space-y-2">
        {classes.map(c => (
          <div key={c._id} className="p-3 bg-white border rounded">
            <div className="flex justify-between items-center">
              <div>{c.name}</div>
              <Link href={`/teachers/${c._id}`} className="text-blue-600">Lehrer</Link>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}
