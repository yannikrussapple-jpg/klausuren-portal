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
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="max-w-2xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-light mb-3">Klausuren</h1>
            <p className="text-gray-400 text-sm">Wähle deine Klasse und Lehrer</p>
          </div>

          {/* Class Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">
              Klasse
            </label>
            <div className="grid grid-cols-2 gap-3">
              {classes.map(c => (
                <button
                  key={c._id}
                  onClick={() => handleSelectClass(c._id)}
                  className={`py-4 px-5 rounded-xl text-left transition-all duration-200 ${
                    selectedClass === c._id
                      ? 'bg-emerald-500 text-black font-medium'
                      : 'bg-[#1a1a1a] text-white hover:bg-[#242424]'
                  }`}
                >
                  <div className="text-lg">{c.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Teacher Selection */}
          {selectedClass && (
            <div className="mb-8 animate-fadeIn">
              <label className="block text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">
                Lehrer
              </label>
              {teachersLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : teachers.length > 0 ? (
                <div className="space-y-3">
                  {teachers.map(t => (
                    <button
                      key={t._id}
                      onClick={() => handleSelectTeacher(t._id)}
                      className={`w-full py-4 px-5 rounded-xl text-left transition-all duration-200 ${
                        selectedTeacher === t._id
                          ? 'bg-emerald-500 text-black font-medium'
                          : 'bg-[#1a1a1a] text-white hover:bg-[#242424]'
                      }`}
                    >
                      <div className="text-lg">{t.name}</div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">
                  Keine Lehrer verfügbar
                </div>
              )}
            </div>
          )}

          {/* Action Button */}
          {selectedClass && selectedTeacher && (
            <div className="fixed bottom-6 left-0 right-0 px-4 max-w-2xl mx-auto animate-fadeIn">
              <button
                onClick={handleViewExams}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-medium py-4 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/20"
              >
                Klausuren anzeigen
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
