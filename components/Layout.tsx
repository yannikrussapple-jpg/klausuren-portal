import React from 'react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ username: string } | null>(null)
  useEffect(() => {
    axios.get('/api/users/me').then(r => setUser(r.data.user)).catch(() => setUser(null))
  }, [])

  const handleLogout = async () => {
    await axios.delete('/api/users/login')
    setUser(null)
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-indigo-600">📚 Klausuren-Portal</h1>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/account/login" className="text-gray-700 hover:text-gray-900">
              {user ? (
                <span className="inline-flex items-center space-x-2">
                  <span className="rounded-full bg-indigo-100 text-indigo-700 px-3 py-1 text-sm">{user.username}</span>
                  <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-gray-900">Logout</button>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-2">
                  <span role="img" aria-label="user">👤</span>
                  <span className="text-sm">Login</span>
                </span>
              )}
            </Link>
          </div>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  )
}
