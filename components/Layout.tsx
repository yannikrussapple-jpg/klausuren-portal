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
          loginWithPassword('admin0401')
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
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <h1 className="text-xl font-semibold text-black">📚 Klausuren</h1>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">👤</span>
                  <span className="text-lg font-semibold text-emerald-600">{user.username}</span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition font-medium group"
                >
                  <span className="text-sm text-gray-700 group-hover:text-black">Logout</span>
                  <span className="text-lg transform group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            ) : (
              <Link href="/account/login" className="text-gray-600 hover:text-black transition">
                <span className="text-sm font-medium">Login</span>
              </Link>
            )}
          </div>
        </nav>
      </header>
      <main className="flex-grow">{children}</main>
      <div className="fixed bottom-4 right-4 text-xs text-gray-400 pointer-events-none">
        by SirGiraffe
      </div>
    </div>
  )
}
