import '../styles/globals.css'
import React from 'react'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useAuthProtection } from '../lib/auth'
import Layout from '../components/Layout'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const { isAuthorized, loading } = useAuthProtection()

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    if (!loading && !isAuthorized && router.pathname !== '/account/login') {
      router.replace('/account/login')
    }
  }, [isAuthorized, loading, router])

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Weiterleitung...</p>
        </div>
      </Layout>
    )
  }

  return <Component {...pageProps} />
}
