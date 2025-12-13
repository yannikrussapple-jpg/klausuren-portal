import React from 'react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ username: string } | null>(null)
  useEffect(() => {
    axios.get('/api/users/me').then(r => {
      setUser(r.data.user)
      // If user is logged in, auto-authorize portal access
      if (r.data.user && typeof window !== 'undefined') {
        import('../lib/auth').then(({ loginWithPassword }) => {
          loginWithPassword('Monte')
        })
      }
    }).catch(() => setUser(null))
  }, [])

  const handleLogout = async () => {
    await axios.delete('/api/users/login')
    setUser(null)
    // Stay on current page after logout, don't redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-indigo-600">📚 Klausuren-Portal</h1>
            </Link>
            {user && (
              <span className="text-sm text-gray-600">Angemeldet als <span className="font-semibold text-indigo-700">{user.username}</span></span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="flex items-center space-x-2 rounded-full bg-indigo-100 text-indigo-700 px-3 py-1 text-sm">
                  <span role="img" aria-label="user">👤</span>
                  <span>{user.username}</span>
                </span>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold">✅</span>
                <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-gray-900 font-medium">Logout</button>
              </div>
            ) : (
              <Link href="/account/login" className="text-gray-700 hover:text-gray-900">
                <span className="inline-flex items-center space-x-2">
                  <span role="img" aria-label="user">👤</span>
                  <span className="text-sm">Login</span>
                </span>
              </Link>
            )}
          </div>
        </nav>
      </header>
      <main className="flex-grow">{children}</main>
      <div className="fixed bottom-0 right-0 p-4 text-sm text-gray-500 pointer-events-none">
        by SirGiraffe
      </div>
    </div>
  )
}
