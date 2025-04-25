import { memo } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserAvatarProps {
  user?: {
    name?: string
    email?: string
    image?: string
  }
  fallback: () => string
  size?: string
}

const UserAvatar = memo(({ user, fallback, size = "h-8 w-8" }: UserAvatarProps) => (
  <Avatar className={`${size} ring-2 ring-primary/10`}>
    <AvatarImage src={user?.image || "/placeholder.svg?height=32&width=32"} alt="Avatar" />
    <AvatarFallback>{fallback()}</AvatarFallback>
  </Avatar>
))

UserAvatar.displayName = "UserAvatar"

export default UserAvatar
