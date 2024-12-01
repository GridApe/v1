'use client';

import React from 'react';
import DashboardWrapper from '@/shared/wrapper/DashboardWrapper';
import { withAuth } from '@/shared/withAuth';

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <DashboardWrapper>{children}</DashboardWrapper>
    </div>
  );
}

export default withAuth(DashboardLayout);
