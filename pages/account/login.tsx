import React, { useState } from 'react'
import Layout from '../../components/Layout'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function AccountLogin() {
  const router = useRouter()
  const nextUrl = (router.query.next as string) || '/'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  React.useEffect(() => {
    if (router.query.registered === '1') {
      setInfo('Registrierung erfolgreich. Bitte mit den Zugangsdaten einloggen.')
    }
  }, [router.query.registered])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await axios.post('/api/users/login', { username, password })
      router.push(nextUrl)
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Login fehlgeschlagen')
    }
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-blue-100">
          <h1 className="text-3xl font-bold mb-2 text-blue-900">Einloggen</h1>
          <p className="text-sm text-gray-600 mb-6">Mit bestehenden Zugangsdaten anmelden.</p>
          {info && <div className="mb-4 rounded-md bg-green-50 text-green-700 px-3 py-2 text-sm">{info}</div>}
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Benutzername</label>
              <input
                autoComplete="off"
                value={username}
                onChange={e=>setUsername(e.target.value)}
                className="mt-1 w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Passwort</label>
              <input
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={e=>setPassword(e.target.value)}
                className="mt-1 w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow">Login</button>
          </form>
          <p className="text-sm text-gray-600 mt-6">Noch kein Konto? <Link href="/account/register" className="text-blue-600 underline font-semibold">Registrieren</Link></p>
        </div>
      </div>
    </Layout>
  )
}
