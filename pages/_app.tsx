import '../styles/globals.css'
import React from 'react'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useAuthProtection } from '../lib/auth'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const { isAuthorized } = useAuthProtection()

  React.useEffect(() => {
    // Always require login on full reloads; in-memory auth is only set after successful login
    if (typeof window === 'undefined') return
    if (!isAuthorized && router.pathname !== '/login') {
      router.replace('/login')
    }
  }, [isAuthorized, router])

  return <Component {...pageProps} />
}
