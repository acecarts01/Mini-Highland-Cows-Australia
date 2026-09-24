import React from 'react';
import { redirect } from 'next/navigation';
import { isAdminRequest } from '@/lib/admin-auth';
import LoginForm from './LoginForm';

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const safeNext = next && next.startsWith('/admin/') ? next : '/admin/portal';
  if (await isAdminRequest()) redirect(safeNext);
  return <LoginForm next={safeNext} />;
}
