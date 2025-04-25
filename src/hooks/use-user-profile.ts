"use client"

import { useCallback } from "react"
import { Session } from 'next-auth';

export const useUserProfile = (session: Session | null) => {
  const getUserInitials = useCallback(() => {
    if (!session?.user) return "U"

    if (session.user.name) {
      const nameParts = session.user.name.split(" ")
      if (nameParts.length > 1) {
        return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase()
      } else {
        return nameParts[0].charAt(0).toUpperCase()
      }
    } else if (session.user.email) {
      return session.user.email.charAt(0).toUpperCase()
    }

    return "U"
  }, [session])

  const getDisplayName = useCallback(() => {
    if (!session?.user) return "User"

    if (session.user.name) {
      return session.user.name
    } else if (session.user.email) {
      return session.user.email.split("@")[0]
    }

    return "User"
  }, [session])

  return {
    getUserInitials,
    getDisplayName,
  }
}
