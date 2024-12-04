import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Adjust path as needed

interface UserAvatarProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge'; // Define possible sizes
}

const UserAvatar: React.FC<UserAvatarProps> = ({ size = 'medium' }) => {
  const { user } = useAuthStore();

  // Default fallback text or initials from first and last name
  const fallbackText =
    user?.first_name && user?.last_name ? `${user.first_name[0]}${user.last_name[0]}` : 'GA'; // Default initials if no name

  // Conditional class names based on the size prop
  const avatarSizeClass = {
    small: 'w-8 h-8 text-sm', // 2rem (32px)
    medium: 'w-12 h-12 text-base', // 3rem (48px)
    large: 'w-16 h-16 text-lg', // 4rem (64px)
    xlarge: 'w-24 h-24',
  };

  const sizeClass = avatarSizeClass[size];

  return (
    <Avatar className={`${sizeClass}`}>
      <AvatarImage src={user?.avatar} alt="User Avatar" />
      <AvatarFallback>{fallbackText}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
