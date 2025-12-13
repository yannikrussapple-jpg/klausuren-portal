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
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 text-sm">Wird geladen...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!isAuthorized) {
    return null
  }

  const handleSelectClass = (classId: string) => {
    setSelectedClass(classId)
    setSelectedTeacher('')
  }

  const handleSelectTeacher = (teacherId: string) => {
    setSelectedTeacher(teacherId)
  }

  const handleViewExams = () => {
    if (!selectedClass || !selectedTeacher) return
    router.push(`/exams?classId=${selectedClass}&teacherId=${selectedTeacher}`)
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Decorative Header Card */}
          <div className="mb-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl p-8 text-white animate-slideUp">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-semibold mb-2">Klausuren</h1>
                <p className="text-emerald-50 text-sm">Wähle deine Klasse und Lehrer aus</p>
              </div>
              <div className="text-6xl opacity-20">📚</div>
            </div>
          </div>

          {/* Class Selection */}
          <div className="mb-8">
            <label className="block text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">
              Deine Klasse
            </label>
            <div className="grid grid-cols-2 gap-3">
              {classes.map((c, idx) => (
                <button
                  key={c._id}
                  onClick={() => handleSelectClass(c._id)}
                  style={{ animationDelay: `${idx * 50}ms` }}
                  className={`py-5 px-5 rounded-2xl text-left transition-all duration-200 animate-fadeIn border-2 ${
                    selectedClass === c._id
                      ? 'bg-black text-white border-black shadow-lg scale-105'
                      : 'bg-white text-black border-gray-200 hover:border-gray-400 hover:shadow-md'
                  }`}
                >
                  <div className="text-lg font-medium">{c.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Teacher Selection */}
          {selectedClass && (
            <div className="mb-24 animate-slideUp">
              <label className="block text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">
                Dein Lehrer
              </label>
              {teachersLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-3 border-black border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : teachers.length > 0 ? (
                <div className="space-y-3">
                  {teachers.map((t, idx) => (
                    <button
                      key={t._id}
                      onClick={() => handleSelectTeacher(t._id)}
                      style={{ animationDelay: `${idx * 50}ms` }}
                      className={`w-full py-5 px-5 rounded-2xl text-left transition-all duration-200 animate-fadeIn border-2 ${
                        selectedTeacher === t._id
                          ? 'bg-black text-white border-black shadow-lg'
                          : 'bg-white text-black border-gray-200 hover:border-gray-400 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-medium">{t.name}</div>
                        {selectedTeacher === t._id && <span className="text-emerald-400">✓</span>}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400 text-sm">
                  Keine Lehrer verfügbar
                </div>
              )}
            </div>
          )}

          {/* Action Button */}
          {selectedClass && selectedTeacher && (
            <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-6 pb-6 px-4 animate-slideUp">
              <div className="max-w-2xl mx-auto">
                <button
                  onClick={handleViewExams}
                  className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-5 rounded-2xl transition-all duration-200 shadow-xl"
                >
                  Klausuren anzeigen →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
