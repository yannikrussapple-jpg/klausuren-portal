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
      // navigate without full reload so in-memory auth remains set
      router.push('/')
    } else {
      setError('Falsches Passwort')
    }
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4 text-center">Passwort erforderlich</h2>
          <p className="text-gray-600 mb-6 text-center">Bitte gib das Portal-Passwort ein.</p>

          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-700">Passwort</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 mb-4 w-full px-3 py-2 border rounded"
              autoFocus
            />

            {error && <div className="text-red-600 mb-4">{error}</div>}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded font-semibold"
            >
              Einloggen
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}
