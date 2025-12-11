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
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Einloggen</h1>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Benutzername</label>
              <input value={username} onChange={e=>setUsername(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Passwort</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button type="submit" className="w-full bg-indigo-600 text-white font-semibold py-2 rounded">Login</button>
          </form>
          <p className="text-sm text-gray-600 mt-4">Noch kein Konto? <Link href="/account/register" className="text-indigo-600 underline">Registrieren</Link></p>
        </div>
      </div>
    </Layout>
  )
}
