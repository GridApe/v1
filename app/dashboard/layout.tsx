'use client';

import React, { ReactNode } from 'react';
import DashboardWrapper from '@/shared/wrapper/DashboardWrapper';
import { withAuth } from '@/shared/withAuth';
import TopBar from '@/app/components/shared/TopBar';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

const getPageInfo = (pathname: string) => {
  const path = pathname.split('/').filter(Boolean);
  
  switch (path[1]) {
    case 'templates':
      if (path[2] === 'ai') {
        return {
          title: 'AI Email Generator',
          description: 'Create beautiful email templates with AI assistance'
        };
      }
      if (path[2] === 'create') {
        return {
          title: 'Create Template',
          description: 'Design your email template from scratch'
        };
      }
      return {
        title: 'Email Templates',
        description: 'Manage your email templates'
      };
    case 'campaigns':
      return {
        title: 'Campaigns',
        description: 'Manage your email campaigns'
      };
    case 'analytics':
      return {
        title: 'Analytics',
        description: 'Track your email performance'
      };
    case 'settings':
      return {
        title: 'Settings',
        description: 'Manage your account settings'
      };
    default:
      return {
        title: 'Dashboard',
        description: 'Welcome to your dashboard'
      };
  }
};

function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { title, description } = getPageInfo(pathname);
  const { user } = useAuthStore();

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!user) return "U";
    return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`;
  };

  // Get avatar URL with proper authentication
  const getAvatarUrl = () => {
    if (!user?.avatar) return '';
    const filename = user.avatar.split('/').pop();
    return `/api/user/avatar/${filename}`;
  };

  return (
    <DashboardWrapper>
      <TopBar 
        title={title} 
        description={description} 
        avatarSrc={getAvatarUrl()}
        avatarFallback={getInitials()} 
      />
      <main className="">
        {children}
      </main>
    </DashboardWrapper>
  );
}

export default withAuth(DashboardLayout);
