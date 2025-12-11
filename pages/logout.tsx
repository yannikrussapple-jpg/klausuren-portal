import React from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { logoutPortal } from '../lib/auth'

export default function LogoutPage() {
  const router = useRouter()

  React.useEffect(() => {
    try {
      logoutPortal()
    } catch (e) {}
    // redirect to login after clearing storage
    router.replace('/login')
  }, [router])

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow">Abmelden… Weiterleitung zur Login-Seite</div>
      </div>
    </Layout>
  )
}
