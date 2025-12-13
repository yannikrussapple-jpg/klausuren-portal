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
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-light text-white mb-3">Portal-Zugang</h2>
          <p className="text-gray-400 text-sm">Bitte gib das Passwort ein</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Passwort"
              className="w-full px-5 py-4 bg-[#1a1a1a] text-white rounded-xl border border-[#2a2a2a] focus:border-emerald-500 focus:outline-none transition-all"
              autoFocus
              autoComplete="off"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm px-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-medium py-4 rounded-xl transition-all duration-200"
          >
            Weiter
          </button>
        </form>
      </div>
    </div>
  )
}
