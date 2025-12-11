import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import axios from 'axios'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useAuthProtection } from '../../lib/auth'

export default function ExamsPage() {
  const router = useRouter()
  const auth = useAuthProtection() as { isAuthorized: boolean; loading: boolean }
  const { isAuthorized, loading } = auth
  const { classId, teacherId } = router.query
  const [exams, setExams] = useState<any[]>([])
  const [selectedExam, setSelectedExam] = useState<any>(null)
  const [teacher, setTeacher] = useState<any>(null)
  const [examsLoading, setExamsLoading] = useState(true)
  // Effects must be declared unconditionally to keep hooks order stable
  useEffect(() => {
    if (loading) return
    if (!isAuthorized) return
    if (!classId || !teacherId) return

    setExamsLoading(true)
    axios
      .get('/api/exams', { params: { classId, teacherId } })
      .then(r => {
        setExams(r.data)
        setExamsLoading(false)
        if (r.data.length > 0) {
          setTeacher(r.data[0].teacherId)
        }
      })
  }, [classId, teacherId, isAuthorized, loading])

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Wird geladen...</p>
        </div>
      </Layout>
    )
  }

  if (!isAuthorized) {
    return null
  }

  const handleLogout = () => {
    try {
      localStorage.removeItem('auth_token')
    } catch (e) {}
    router.reload()
  }

  if (!classId || !teacherId) {
    return (
      <Layout onLogout={handleLogout}>
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Keine Klasse oder Lehrer ausgewählt</p>
          <Link href="/" className="text-blue-600 underline">Zurück zur Startseite</Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout onLogout={handleLogout}>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">← Zurück</Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Klausuren</h1>
            {teacher && <p className="text-lg text-gray-600">{teacher.name}</p>}
          </div>

          {examsLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Lade Klausuren...</p>
            </div>
          ) : exams.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Keine Klausuren vorhanden</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Exams List */}
              <div className="lg:col-span-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Verfügbare Klausuren</h2>
                <div className="space-y-3">
                  {exams.map((exam) => (
                    <button
                      key={exam._id}
                      onClick={() => setSelectedExam(exam)}
                      className={`w-full text-left p-4 rounded-lg transition ${
                        selectedExam?._id === exam._id
                          ? 'bg-indigo-600 text-white shadow-lg'
                          : 'bg-white text-gray-900 border border-gray-200 hover:border-indigo-300 hover:shadow-md'
                      }`}
                    >
                      <div className="font-semibold">{exam.title}</div>
                      <div className={`text-sm ${selectedExam?._id === exam._id ? 'text-indigo-100' : 'text-gray-500'}`}>
                        Klausur Nr. {exam.number}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Exam Viewer */}
              <div className="lg:col-span-2">
                {selectedExam ? (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedExam.title}</h2>
                    <p className="text-gray-600 mb-6">Klausur Nummer: {selectedExam.number}</p>
                    
                    {/* PDF Viewer */}
                    <div className="bg-gray-100 rounded-lg overflow-hidden mb-6">
                      <iframe
                        src={selectedExam.fileUrl}
                        className="w-full h-96"
                        title={selectedExam.title}
                      />
                    </div>

                    {/* Download Button */}
                    <a
                      href={selectedExam.fileUrl}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
                    >
                      📥 Dokument herunterladen
                    </a>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-lg p-6 text-center text-gray-500">
                    Wähle eine Klausur aus, um sie anzuschauen
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
