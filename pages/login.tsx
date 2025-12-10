import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to home — login has been removed for this dev build
    router.replace('/')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center text-gray-600">Login entfernt — du wirst weitergeleitet.</div>
    </div>
  )
}
