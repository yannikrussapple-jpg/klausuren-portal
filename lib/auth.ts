import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export function useAuthProtection() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Don't run on login page
    if (router.pathname === '/login') {
      setLoading(false)
      return
    }

    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.push('/login')
    } else {
      setIsAuthorized(true)
      setLoading(false)
    }
  }, [router])

  return { isAuthorized, loading }
}

export function withAuthProtection(Component: any) {
  return function ProtectedComponent(props: any) {
    const { isAuthorized, loading } = useAuthProtection()

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Wird geladen...</p>
        </div>
      )
    }

    if (!isAuthorized) {
      return null
    }

    return <Component {...props} />
  }
}
