'use client';

import React, { ReactNode } from 'react';
import DashboardWrapper from '@/shared/wrapper/DashboardWrapper';
import { withAuth } from '@/shared/withAuth';
import TopBar from '@/app/components/shared/TopBar';
import { usePathname } from 'next/navigation';

const getPageInfo = (pathname: string) => {
  const path = pathname.split('/').filter(Boolean);
    console.log({path})
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
    case 'campaign':
      return {
        title: 'Campaigns',
        description: 'Manage your email campaigns'
      };
    case 'audience':
      return {
        title: 'Audience',
        description: 'Manage your Audience'
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

  return (
    <DashboardWrapper>
      <TopBar 
        title={title} 
        description={description} 
        avatarFallback="U" 
      />
      <main className="">
        {children}
      </main>
    </DashboardWrapper>
  );
}

export default withAuth(DashboardLayout);
