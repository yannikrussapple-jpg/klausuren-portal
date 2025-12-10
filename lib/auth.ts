import React from 'react'

// For local development: disable password redirect so the app is immediately
// accessible without entering a password. The login API remains unchanged
// (useful if you want to re-enable auth later).
export function useAuthProtection() {
  const isAuthorized = true
  const loading = false
  return { isAuthorized, loading }
}

export function withAuthProtection(Component: any) {
  return function ProtectedComponent(props: any) {
    return React.createElement(Component, props)
  }
}
