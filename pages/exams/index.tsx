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
  const { classId, teacherId, purchased } = router.query
  const [exams, setExams] = useState<any[]>([])
  const [selectedExam, setSelectedExam] = useState<any>(null)
  const [teacher, setTeacher] = useState<any>(null)
  const [examsLoading, setExamsLoading] = useState(true)
  const [purchaseStatus, setPurchaseStatus] = useState<{[key: string]: boolean}>({})
  const [checkingPurchase, setCheckingPurchase] = useState(false)

  // Show success message if just purchased
  useEffect(() => {
    if (purchased && typeof purchased === 'string') {
      // User just purchased an exam, show success
      setTimeout(() => {
        router.replace(`/exams?classId=${classId}&teacherId=${teacherId}`, undefined, { shallow: true })
      }, 3000)
    }
  }, [purchased])

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

  // Check purchase status when exam is selected
  useEffect(() => {
    if (!selectedExam) return
    
    const checkPurchase = async () => {
      setCheckingPurchase(true)
      try {
        const response = await axios.get(`/api/payment/check-purchase?examId=${selectedExam._id}`)
        setPurchaseStatus(prev => ({
          ...prev,
          [selectedExam._id]: response.data.purchased
        }))
      } catch (error) {
        console.error('Error checking purchase:', error)
      }
      setCheckingPurchase(false)
    }

    if (purchaseStatus[selectedExam._id] === undefined) {
      checkPurchase()
    }
  }, [selectedExam])

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
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Keine Klasse oder Lehrer ausgewählt</p>
          <Link href="/" className="text-blue-600 underline">Zurück zur Startseite</Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <Link href="/" className="inline-flex items-center text-gray-600 hover:text-black mb-6 font-medium transition">
              <span className="mr-2">←</span> Zurück
            </Link>
            <div className="flex items-baseline space-x-4 mb-2">
              <h1 className="text-4xl font-semibold text-black">Klausuren</h1>
              {teacher && <span className="text-xl text-gray-500">{teacher.name}</span>}
            </div>
            <div className="h-1 w-20 bg-black rounded-full"></div>
          </div>

          {examsLoading ? (
            <div className="text-center py-16">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
              <p className="text-gray-600 mt-4">Lade Klausuren...</p>
            </div>
          ) : exams.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
              <div className="text-5xl mb-4">📚</div>
              <p className="text-gray-600 text-lg">Keine Klausuren vorhanden</p>
            </div>
          ) : (
            <>
              {/* Success Message */}
              {purchased && (
                <div className="mb-6 bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 animate-fade-in">
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl">✅</span>
                    <div>
                      <h3 className="font-semibold text-emerald-900 text-lg">Kauf erfolgreich!</h3>
                      <p className="text-emerald-700 text-sm">Du hast jetzt unbegrenzten Zugriff auf diese Klausur.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Exams List */}
              <div className="lg:col-span-1 space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-black">Verfügbar</h2>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">{exams.length} {exams.length === 1 ? 'Klausur' : 'Klausuren'}</span>
                </div>
                <div className="space-y-3">
                  {exams.map((exam) => (
                    <button
                      key={exam._id}
                      onClick={() => setSelectedExam(exam)}
                      className={`w-full text-left p-5 rounded-xl transition-all duration-200 ${
                        selectedExam?._id === exam._id
                          ? 'bg-black text-white shadow-lg scale-[1.02]'
                          : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-black hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-semibold mb-1">{exam.title}</div>
                          <div className={`text-sm ${selectedExam?._id === exam._id ? 'text-gray-300' : 'text-gray-500'}`}>
                            Nr. {exam.number}
                          </div>
                        </div>
                        <div className={`text-2xl ${selectedExam?._id === exam._id ? 'opacity-100' : 'opacity-30'}`}>
                          📄
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Exam Viewer */}
              <div className="lg:col-span-2">
                {selectedExam ? (
                  <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
                    <div className="p-8 border-b-2 border-gray-200 bg-gradient-to-br from-gray-50 to-white">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h2 className="text-3xl font-semibold text-black mb-2">{selectedExam.title}</h2>
                          <div className="flex items-center space-x-3 text-sm">
                            <span className="text-gray-600">Klausur Nummer</span>
                            <span className="bg-black text-white px-3 py-1 rounded-full font-medium">{selectedExam.number}</span>
                          </div>
                        </div>
                        <div className="text-5xl">📝</div>
                      </div>
                    </div>
                    
                    {/* PDF Viewer */}
                    <div className="bg-gray-100 border-y-2 border-gray-200">
                      <iframe
                        src={selectedExam.fileUrl}
                        className="w-full h-[500px]"
                        title={selectedExam.title}
                      />
                    </div>

                    {/* Download Section */}
                    <div className="p-8 bg-gradient-to-br from-white to-gray-50">
                      {checkingPurchase ? (
                        <div className="text-center py-8">
                          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
                          <p className="text-gray-600 text-sm mt-2">Prüfe Zugriff...</p>
                        </div>
                      ) : purchaseStatus[selectedExam._id] ? (
                        // User has purchased - allow download
                        <div>
                          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
                            <div className="flex items-center space-x-2 text-emerald-700">
                              <span className="text-xl">✓</span>
                              <span className="font-medium text-sm">Du besitzt diese Klausur</span>
                            </div>
                          </div>
                          <button
                            onClick={() => window.open(selectedExam.fileUrl, '_blank')}
                            className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
                          >
                            <span className="text-2xl">📥</span>
                            <span>Dokument herunterladen</span>
                          </button>
                          <p className="text-xs text-gray-500 text-center mt-4">PDF wird in einem neuen Tab geöffnet</p>
                        </div>
                      ) : (
                        // User hasn't purchased - show payment option
                        <div>
                          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                            <div className="flex items-start space-x-3">
                              <span className="text-2xl">💳</span>
                              <div className="flex-1">
                                <h3 className="font-semibold text-amber-900 mb-1">Klausur kaufen</h3>
                                <p className="text-sm text-amber-800">Einmaliger Kauf für <span className="font-bold">2,99 €</span></p>
                                <p className="text-xs text-amber-700 mt-1">Lebenslanger Zugriff • Unbegrenzte Downloads</p>
                              </div>
                            </div>
                          </div>
                          
                          <button
                            onClick={async () => {
                              try {
                                const r = await axios.get('/api/users/me')
                                if (r.data?.user) {
                                  // User is logged in, redirect to payment
                                  router.push(`/payment?examId=${selectedExam._id}&examTitle=${encodeURIComponent(selectedExam.title)}&price=2.99&classId=${classId}&teacherId=${teacherId}`)
                                } else {
                                  // User not logged in, store intent and redirect to login
                                  sessionStorage.setItem('pendingDownload', selectedExam.fileUrl)
                                  const currentPath = `${router.pathname}${router.asPath.includes('?') ? router.asPath.substring(router.asPath.indexOf('?')) : ''}`
                                  router.push(`/account/login?next=${encodeURIComponent(currentPath)}`)
                                }
                              } catch {
                                sessionStorage.setItem('pendingDownload', selectedExam.fileUrl)
                                const currentPath = `${router.pathname}${router.asPath.includes('?') ? router.asPath.substring(router.asPath.indexOf('?')) : ''}`
                                router.push(`/account/login?next=${encodeURIComponent(currentPath)}`)
                              }
                            }}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
                          >
                            <span className="text-2xl">🛒</span>
                            <span>Jetzt kaufen - 2,99 €</span>
                          </button>
                          
                          <div className="mt-4 text-center">
                            <p className="text-xs text-gray-500">Sichere Zahlung mit PayPal</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300 p-16 text-center">
                    <div className="text-6xl mb-4">👈</div>
                    <p className="text-gray-600 text-lg font-medium">Wähle eine Klausur aus</p>
                    <p className="text-gray-500 text-sm mt-2">Klicke auf eine Klausur in der Liste</p>
                  </div>
                )}
              </div>
            </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}
