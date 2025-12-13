import React, { useState } from 'react'
import Layout from '../components/Layout'
import { useRouter } from 'next/router'
import { loginWithPassword } from '../lib/auth'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const ok = loginWithPassword(password)
    if (ok) {
      router.push('/')
    } else {
      setError('Falsches Passwort')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="mb-8 text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-3xl font-semibold text-black mb-3">Portal-Zugang</h2>
          <p className="text-gray-600 text-sm">Bitte gib das Passwort ein</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Passwort"
              className="w-full px-6 py-5 bg-white text-black rounded-2xl border-2 border-gray-200 focus:border-black focus:outline-none transition-all shadow-sm"
              autoFocus
              autoComplete="off"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm px-2 font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-5 rounded-2xl transition-all duration-200 shadow-lg"
          >
            Weiter →
          </button>
        </form>
      </div>
    </div>
  )
}
