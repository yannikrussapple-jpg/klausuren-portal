import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import axios from 'axios'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'

export default function PaymentPage() {
  const router = useRouter()
  const { examId, examTitle, price } = router.query
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)

  const examPrice = price ? parseFloat(price as string) : 2.99

  const createOrder = async () => {
    try {
      const response = await axios.post('/api/payment/create-order', {
        examId,
        examTitle,
        price: examPrice
      })
      return response.data.orderID
    } catch (err) {
      setError('Fehler beim Erstellen der Bestellung')
      throw err
    }
  }

  const onApprove = async (data: any) => {
    setProcessing(true)
    try {
      const response = await axios.post('/api/payment/capture-order', {
        orderID: data.orderID,
        examId
      })

      if (response.data.success) {
        // Payment successful, redirect back to exams page
        router.push(`/exams?classId=${router.query.classId}&teacherId=${router.query.teacherId}&purchased=${examId}`)
      }
    } catch (err) {
      setError('Zahlung fehlgeschlagen')
      setProcessing(false)
    }
  }

  if (!examId || !examTitle) {
    return (
      <Layout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <p className="text-gray-600">Ungültige Zahlung</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 border-b-2 border-gray-200">
              <div className="text-center mb-4">
                <div className="text-5xl mb-4">💳</div>
                <h1 className="text-3xl font-semibold text-black mb-2">Klausur kaufen</h1>
                <p className="text-gray-600">Einmaliger Kauf - Lebenslanger Zugriff</p>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-8 border-b-2 border-gray-200">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-black mb-2">{examTitle}</h2>
                  <p className="text-sm text-gray-600">PDF-Dokument zum Download</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-black">{examPrice.toFixed(2)} €</div>
                  <div className="text-xs text-gray-500 mt-1">inkl. MwSt.</div>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">✓</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-emerald-900 mb-1">Was du erhältst:</h3>
                    <ul className="text-sm text-emerald-800 space-y-1">
                      <li>• Sofortiger Zugriff nach Zahlung</li>
                      <li>• Unbegrenzte Downloads</li>
                      <li>• Lebenslanger Zugriff</li>
                      <li>• Hochqualitatives PDF</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* PayPal Payment */}
            <div className="p-8">
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm font-medium">
                  {error}
                </div>
              )}

              {processing ? (
                <div className="text-center py-8">
                  <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black mb-4"></div>
                  <p className="text-gray-600">Zahlung wird verarbeitet...</p>
                </div>
              ) : (
                <div>
                  <h3 className="font-semibold text-black mb-4">Zahlungsmethode</h3>
                  <PayPalScriptProvider options={{ 
                    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
                    currency: 'EUR'
                  }}>
                    <PayPalButtons
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={(err) => {
                        console.error('PayPal error:', err)
                        setError('PayPal Fehler aufgetreten')
                      }}
                      style={{
                        layout: 'vertical',
                        color: 'black',
                        shape: 'rect',
                        label: 'pay'
                      }}
                    />
                  </PayPalScriptProvider>
                </div>
              )}

              <div className="mt-6 pt-6 border-t-2 border-gray-200">
                <button
                  onClick={() => router.back()}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transition"
                >
                  ← Zurück
                </button>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              🔒 Sichere Zahlung über PayPal • Deine Daten sind geschützt
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
