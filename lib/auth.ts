import React from 'react'

// In-memory auth flag. Not persisted — cleared on full page reload.
let memoryAuth = false
const PASSWORD = 'admin0401'

export function useAuthProtection(): { isAuthorized: boolean; loading: boolean } {
  const [isAuthorized, setIsAuthorized] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const update = () => {
      setIsAuthorized(!!memoryAuth)
      setLoading(false)
    }
    update()
    window.addEventListener('portal-auth', update)
    return () => window.removeEventListener('portal-auth', update)
  }, [])

  return { isAuthorized, loading }
}

export function loginWithPassword(password: string) {
  if (password === PASSWORD) {
    memoryAuth = true
    // notify listeners (App wrapper) so it can re-check and redirect
    try {
      window.dispatchEvent(new Event('portal-auth'))
    } catch (e) {}
    return true
  }
  return false
}

export function logoutPortal() {
  memoryAuth = false
  try {
    window.dispatchEvent(new Event('portal-auth'))
  } catch (e) {}
}

export function isAuthorizedMemory() {
  return !!memoryAuth
}
