'use client';

import React from 'react';
import DashboardWrapper from '@/shared/wrapper/DashboardWrapper';
import { withAuth } from '@/shared/withAuth';
import { DashboardProvider } from '@/app/context/DashboardContext';

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <div>
        <DashboardWrapper>{children}</DashboardWrapper>
      </div>
    </DashboardProvider>
  );
}

export default withAuth(DashboardLayout);