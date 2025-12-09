import React from 'react'
import Link from 'next/link'

export default function Layout({ children, onLogout }: { children: React.ReactNode; onLogout?: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-indigo-600">📚 Klausuren-Portal</h1>
          </Link>
          {onLogout && (
            <button
              onClick={onLogout}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              Logout
            </button>
          )}
        </nav>
      </header>
      <main>{children}</main>
    </div>
  )
}
