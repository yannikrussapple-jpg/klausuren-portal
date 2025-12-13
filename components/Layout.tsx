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
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <header className="bg-[#1a1a1a] border-b border-[#2a2a2a]">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <h1 className="text-xl font-light text-white">📚 Klausuren</h1>
            </Link>
            {user && (
              <span className="text-xs text-gray-500">• <span className="text-emerald-500">{user.username}</span></span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-white transition">Logout</button>
              </div>
            ) : (
              <Link href="/account/login" className="text-gray-400 hover:text-white transition">
                <span className="text-sm">Login</span>
              </Link>
            )}
          </div>
        </nav>
      </header>
      <main className="flex-grow">{children}</main>
      <div className="fixed bottom-4 right-4 text-xs text-gray-600 pointer-events-none">
        by SirGiraffe
      </div>
    </div>
  )
}
