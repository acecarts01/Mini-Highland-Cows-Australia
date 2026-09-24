'use client';

import React from 'react';
import { LogOut } from 'lucide-react';

export default function AdminSignOut() {
  return (
    <button
      type="button"
      onClick={async () => {
        await fetch('/api/admin/session', { method: 'DELETE' });
        window.location.href = '/admin/login';
      }}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#705d48] hover:text-[#232320] transition-colors cursor-pointer"
    >
      <LogOut className="w-3.5 h-3.5" />
      Sign out
    </button>
  );
}
