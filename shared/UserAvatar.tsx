import { useAuthStore } from "@/store/authStore"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserAvatarProps {
  size?: "small" | "medium" | "large" | "xlarge"
}

const UserAvatar = ({ size = "medium" }: UserAvatarProps) => {
  const { user } = useAuthStore()
  console.log(user?.avatar);
  
  // Size classes
  const sizeClasses = {
    small: "h-8 w-8",
    medium: "h-10 w-10",
    large: "h-12 w-12",
    xlarge: "h-20 w-20",
  }
  
  // Get initials for fallback
  const getInitials = () => {
    if (!user) return "U"
    return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`
  }

  return (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage 
        src={user?.avatar || ''} 
        alt={user?.first_name || 'User'} 
        className="object-cover"
      />
      <AvatarFallback>{getInitials()}</AvatarFallback>
    </Avatar>
  )
}

export default UserAvatar