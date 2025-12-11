import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useAuthProtection } from '../lib/auth'

export default function Home() {
  const router = useRouter()
  const { isAuthorized, loading } = useAuthProtection()
  const [classes, setClasses] = useState<any[]>([])
  const [teachers, setTeachers] = useState<any[]>([])
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [selectedTeacher, setSelectedTeacher] = useState<string>('')
  const [teachersLoading, setTeachersLoading] = useState(false)
  // Effects must be declared unconditionally (avoid conditional hooks)
  // Load all classes when authorized
  useEffect(() => {
    if (!isAuthorized) return
    const loadClasses = async () => {
      try {
        const response = await axios.get('/api/classes')
        setClasses(response.data)
      } catch (error) {
        console.error('Error loading classes:', error)
      }
    }
    loadClasses()
  }, [isAuthorized])

  // Load teachers when class is selected (and when authorized)
  useEffect(() => {
    if (!isAuthorized) return
    if (!selectedClass) {
      setTeachers([])
      return
    }

    const loadTeachers = async () => {
      try {
        setTeachersLoading(true)
        const response = await axios.get('/api/teachers', {
          params: { classId: selectedClass }
        })
        setTeachers(response.data)
        setTeachersLoading(false)
      } catch (error) {
        console.error('Error loading teachers:', error)
        setTeachersLoading(false)
      }
    }

    loadTeachers()
  }, [selectedClass, isAuthorized])

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

  const handleSelectClass = (classId: string) => {
    setSelectedClass(classId)
    setSelectedTeacher('') // Reset teacher when class changes
  }

  const handleSelectTeacher = (teacherId: string) => {
    setSelectedTeacher(teacherId)
  }

  const handleViewExams = () => {
    if (!selectedClass || !selectedTeacher) return
    router.push(`/exams?classId=${selectedClass}&teacherId=${selectedTeacher}`)
  }

  const handleLogout = () => {
    // No auth in dev: simply reload to reset UI state
    try {
      localStorage.removeItem('auth_token')
    } catch (e) {}
    router.reload()
  }

  return (
    <Layout onLogout={handleLogout}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">Klausuren Portal</h1>
            <p className="text-center text-gray-600 mb-8">Wähle deine Klasse und deinen Lehrer, um die Klausuren zu sehen</p>

            <div className="space-y-6">
              {/* Klasse Selection */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">Schulklasse</label>
                <div className="grid grid-cols-2 gap-3">
                  {classes.map(c => (
                    <button
                      key={c._id}
                      onClick={() => handleSelectClass(c._id)}
                      className={`py-3 px-4 rounded-lg font-semibold transition ${
                        selectedClass === c._id
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lehrer Selection */}
              {selectedClass && (
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">Lehrer</label>
                  {teachersLoading ? (
                    <div className="text-center py-4 text-gray-600">Lade Lehrer...</div>
                  ) : teachers.length > 0 ? (
                    <div className="space-y-2">
                      {teachers.map(t => (
                        <button
                          key={t._id}
                          onClick={() => handleSelectTeacher(t._id)}
                          className={`w-full py-3 px-4 rounded-lg font-semibold transition text-left ${
                            selectedTeacher === t._id
                              ? 'bg-indigo-600 text-white shadow-md'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {t.name}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-600">Keine Lehrer gefunden</div>
                  )}
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleViewExams}
                disabled={!selectedClass || !selectedTeacher}
                className={`w-full py-3 px-4 rounded-lg font-bold text-white text-lg transition ${
                  selectedClass && selectedTeacher
                    ? 'bg-green-600 hover:bg-green-700 cursor-pointer shadow-md'
                    : 'bg-gray-400 cursor-not-allowed opacity-50'
                }`}
              >
                Klausuren anschauen
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
