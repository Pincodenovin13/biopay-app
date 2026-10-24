'use client';

import React, { ReactNode } from 'react';
import { AdminConsoleView } from '../../components/admin/AdminConsoleView';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminConsoleView
      onExitAdmin={() => {
        window.location.href = '/';
      }}
    />
  );
}
