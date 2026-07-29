'use server';

import {
  fetchAllLeads,
  updateLeadStatus,
  insertBlog,
  deleteBlog,
  LeadData,
  BlogPostData,
} from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'onestudio2025';

export async function verifyAdminPasscodeAction(passcode: string): Promise<{ success: boolean; token?: string; error?: string }> {
  if (passcode.trim() === ADMIN_PASSCODE) {
    // Return simple session verification hash
    return { success: true, token: 'authenticated_admin_session_valid' };
  }
  return { success: false, error: 'Invalid admin passcode.' };
}

export async function getLeadsAction(): Promise<LeadData[]> {
  return await fetchAllLeads();
}

export async function updateLeadStatusAction(id: string, status: string): Promise<{ success: boolean }> {
  const ok = await updateLeadStatus(id, status);
  if (ok) {
    revalidatePath('/admin/dashboard');
  }
  return { success: ok };
}

export async function createBlogAction(blog: BlogPostData): Promise<{ success: boolean; error?: string }> {
  if (!blog.title || !blog.slug || !blog.content) {
    return { success: false, error: 'Title, slug, and content are required.' };
  }

  const result = await insertBlog(blog);
  if (result.success) {
    revalidatePath('/news');
    revalidatePath(`/news/${blog.slug}`);
    revalidatePath('/admin/dashboard');
  }
  return result;
}

export async function deleteBlogAction(idOrSlug: string): Promise<{ success: boolean }> {
  const ok = await deleteBlog(idOrSlug);
  if (ok) {
    revalidatePath('/news');
    revalidatePath('/admin/dashboard');
  }
  return { success: ok };
}
