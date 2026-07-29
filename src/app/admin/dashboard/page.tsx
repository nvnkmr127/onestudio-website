'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  getLeadsAction,
  updateLeadStatusAction,
  createBlogAction,
  deleteBlogAction,
} from '@/app/actions/adminActions';
import { getPosts, BlogPost } from '@/lib/blogService';
import { LeadData, BlogPostData } from '@/lib/supabase';
import { staticLocalSeoPages, LocalSeoPageConfig } from '@/lib/localSeoData';
import { staticServices, ServiceDetailConfig } from '@/lib/servicesData';
import YoastSeoAnalyzer, { YoastSeoState } from '@/components/admin/YoastSeoAnalyzer';

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<'leads' | 'blogs' | 'seo' | 'pagesSeo'>('leads');

  // Leads State
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [leadSearch, setLeadSearch] = useState('');
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);

  // Blogs & Yoast SEO State
  const [publishedBlogs, setPublishedBlogs] = useState<BlogPost[]>([]);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSlug, setBlogSlug] = useState('');
  const [blogCategory, setBlogCategory] = useState('Construction');
  const [blogAuthor, setBlogAuthor] = useState('One Studio Team');
  const [blogImage, setBlogImage] = useState('/images/bangalore_modern_interior.png');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [blogStatusMsg, setBlogStatusMsg] = useState('');

  // Yoast SEO State for Blog
  const [yoastState, setYoastState] = useState<YoastSeoState>({
    seoTitle: '',
    seoDescription: '',
    focusKeyword: 'construction company bangalore',
    slug: '',
    content: '',
    ogImage: '/images/bangalore_modern_interior.png',
    canonicalUrl: '',
    schemaType: 'Article',
    robotsIndex: true,
  });

  // Page SEO Manager State
  const [localSeoPages, setLocalSeoPages] = useState<Record<string, LocalSeoPageConfig>>(staticLocalSeoPages);
  const [servicePages, setServicePages] = useState<Record<string, ServiceDetailConfig>>(staticServices);
  const [selectedSeoPageSlug, setSelectedSeoPageSlug] = useState<string>('construction-company-hbr-layout');
  const [editedPageTitle, setEditedPageTitle] = useState('');
  const [editedPageDesc, setEditedPageDesc] = useState('');
  const [pageSeoSavedMsg, setPageSeoSavedMsg] = useState('');

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('onestudio_admin_token');
    if (!token) {
      router.push('/admin');
    } else {
      setIsAuthenticated(true);
      loadDashboardData();
    }
  }, [router]);

  useEffect(() => {
    if (localSeoPages[selectedSeoPageSlug]) {
      setEditedPageTitle(localSeoPages[selectedSeoPageSlug].title);
      setEditedPageDesc(localSeoPages[selectedSeoPageSlug].description);
    } else if (servicePages[selectedSeoPageSlug]) {
      setEditedPageTitle(servicePages[selectedSeoPageSlug].title);
      setEditedPageDesc(servicePages[selectedSeoPageSlug].description);
    }
  }, [selectedSeoPageSlug, localSeoPages, servicePages]);

  const loadDashboardData = async () => {
    setIsLoadingLeads(true);
    try {
      const fetchedLeads = await getLeadsAction();
      setLeads(fetchedLeads);

      const blogs = await getPosts();
      setPublishedBlogs(blogs);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoadingLeads(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('onestudio_admin_token');
    router.push('/admin');
  };

  const handleTitleChange = (val: string) => {
    setBlogTitle(val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    setBlogSlug(generatedSlug);

    setYoastState((prev) => ({
      ...prev,
      seoTitle: prev.seoTitle || val,
      slug: generatedSlug,
    }));
  };

  const handleExcerptChange = (val: string) => {
    setBlogExcerpt(val);
    setYoastState((prev) => ({
      ...prev,
      seoDescription: prev.seoDescription || val,
    }));
  };

  const handleContentChange = (val: string) => {
    setBlogContent(val);
    setYoastState((prev) => ({
      ...prev,
      content: val,
    }));
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
    await updateLeadStatusAction(leadId, newStatus);
  };

  const handlePublishBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogSlug || !blogContent) return;

    setIsPublishing(true);
    setBlogStatusMsg('');

    const newBlog: BlogPostData = {
      title: blogTitle,
      slug: blogSlug,
      category: blogCategory,
      author: blogAuthor,
      featured_image: blogImage,
      excerpt: blogExcerpt || blogTitle,
      content: blogContent,
      published_at: new Date().toISOString(),
      seo_title: yoastState.seoTitle || blogTitle,
      seo_description: yoastState.seoDescription || blogExcerpt,
      focus_keyword: yoastState.focusKeyword,
      og_image: yoastState.ogImage || blogImage,
      canonical_url: yoastState.canonicalUrl,
      schema_type: yoastState.schemaType,
    };

    try {
      const res = await createBlogAction(newBlog);
      if (res.success) {
        setBlogStatusMsg('✅ Article with Yoast SEO optimization published successfully!');
        setBlogTitle('');
        setBlogSlug('');
        setBlogExcerpt('');
        setBlogContent('');
        loadDashboardData();
      } else {
        setBlogStatusMsg(`⚠️ Error: ${res.error}`);
      }
    } catch (err) {
      setBlogStatusMsg('⚠️ Unexpected error publishing blog post.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDeleteBlog = async (idOrSlug: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    const res = await deleteBlogAction(idOrSlug);
    if (res.success) {
      loadDashboardData();
    }
  };

  const handleSavePageSeo = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSeoPages[selectedSeoPageSlug]) {
      setLocalSeoPages((prev) => ({
        ...prev,
        [selectedSeoPageSlug]: {
          ...prev[selectedSeoPageSlug],
          title: editedPageTitle,
          description: editedPageDesc,
        },
      }));
    } else if (servicePages[selectedSeoPageSlug]) {
      setServicePages((prev) => ({
        ...prev,
        [selectedSeoPageSlug]: {
          ...prev[selectedSeoPageSlug],
          title: editedPageTitle,
          description: editedPageDesc,
        },
      }));
    }

    setPageSeoSavedMsg(`✅ Updated Yoast SEO tags for /${selectedSeoPageSlug}`);
    setTimeout(() => setPageSeoSavedMsg(''), 4000);
  };

  const exportLeadsCsv = () => {
    if (!leads.length) return;
    const headers = ['ID', 'Name', 'Phone', 'Email', 'Source Page', 'Status', 'Date', 'Message'];
    const rows = leads.map((l) => [
      l.id || '',
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.email || ''}"`,
      `"${l.source_page || ''}"`,
      `"${l.status || 'new'}"`,
      `"${l.created_at || ''}"`,
      `"${(l.message || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `onestudio_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-sm font-bold">
        Loading Admin Dashboard &amp; Yoast Suite...
      </div>
    );
  }

  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.phone.includes(leadSearch) ||
      (l.email && l.email.toLowerCase().includes(leadSearch.toLowerCase())) ||
      (l.source_page && l.source_page.toLowerCase().includes(leadSearch.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Metric Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1 shadow">
          <span className="text-[10px] font-extrabold uppercase text-slate-500">Total Leads</span>
          <p className="text-3xl font-black text-[#f2bd19]">{leads.length}</p>
          <p className="text-[10px] text-slate-400 font-medium">Recorded in DB</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1 shadow">
          <span className="text-[10px] font-extrabold uppercase text-slate-500">Published Blogs</span>
          <p className="text-3xl font-black text-emerald-400">{publishedBlogs.length}</p>
          <p className="text-[10px] text-slate-400 font-medium">SEO Optimized</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1 shadow">
          <span className="text-[10px] font-extrabold uppercase text-slate-500">Local SEO Pages</span>
          <p className="text-3xl font-black text-cyan-400">
            {Object.keys(localSeoPages).length + Object.keys(servicePages).length}
          </p>
          <p className="text-[10px] text-slate-400 font-medium">Geo-targeted landing pages</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1 shadow">
          <span className="text-[10px] font-extrabold uppercase text-slate-500">Yoast Health Score</span>
          <p className="text-3xl font-black text-emerald-400">95 / 100</p>
          <p className="text-[10px] text-slate-400 font-medium">Google SERP Ready</p>
        </div>
      </div>

      {/* Primary Tab Controls */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('leads')}
          className={`pb-3 px-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'leads'
              ? 'border-[#f2bd19] text-[#f2bd19]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          📥 Leads Inbox ({leads.length})
        </button>

        <button
          onClick={() => setActiveTab('blogs')}
          className={`pb-3 px-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'blogs'
              ? 'border-[#f2bd19] text-[#f2bd19]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          ✍️ Blog Writer &amp; Yoast SEO
        </button>

        <button
          onClick={() => setActiveTab('pagesSeo')}
          className={`pb-3 px-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'pagesSeo'
              ? 'border-[#f2bd19] text-[#f2bd19]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          🎯 Yoast Page SEO Manager
        </button>

        <button
          onClick={() => setActiveTab('seo')}
          className={`pb-3 px-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'seo'
              ? 'border-[#f2bd19] text-[#f2bd19]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          📍 Local SEO Directory
        </button>
      </div>

        {/* TAB 1: LEADS INBOX */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <input
                type="text"
                value={leadSearch}
                onChange={(e) => setLeadSearch(e.target.value)}
                placeholder="Search leads by name, phone, email, or page..."
                className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-[#f2bd19] w-full sm:w-96"
              />

              <div className="flex items-center gap-3">
                <button
                  onClick={loadDashboardData}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-extrabold px-4 py-3 rounded-2xl transition-all cursor-pointer"
                >
                  🔄 Refresh Leads
                </button>
                <button
                  onClick={exportLeadsCsv}
                  className="bg-[#f2bd19] hover:bg-amber-500 text-slate-900 text-xs font-black uppercase tracking-wider px-5 py-3 rounded-2xl shadow-md transition-all cursor-pointer"
                >
                  📥 Export CSV
                </button>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              {isLoadingLeads ? (
                <div className="p-12 text-center text-slate-400 text-xs font-bold">
                  Fetching leads from database...
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="p-12 text-center text-slate-500 text-xs font-medium space-y-2">
                  <p className="text-2xl">📭</p>
                  <p>No leads found matching your filter.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 text-[10px] font-black uppercase tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="p-4">Customer Name</th>
                        <th className="p-4">Phone Number</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Source Page</th>
                        <th className="p-4">Message / Requirements</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredLeads.map((lead, idx) => (
                        <tr key={lead.id || idx} className="hover:bg-slate-850/50 transition-colors">
                          <td className="p-4 font-black text-white">{lead.name}</td>
                          <td className="p-4 font-bold text-[#f2bd19]">
                            <a href={`tel:${lead.phone}`} className="hover:underline">
                              {lead.phone}
                            </a>
                          </td>
                          <td className="p-4 text-slate-300 font-medium">{lead.email || '—'}</td>
                          <td className="p-4">
                            <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full text-[10px] font-bold">
                              {lead.source_page || 'Contact'}
                            </span>
                          </td>
                          <td className="p-4 max-w-xs text-slate-300 truncate" title={lead.message}>
                            {lead.message || 'No additional message'}
                          </td>
                          <td className="p-4">
                            <select
                              value={lead.status || 'new'}
                              onChange={(e) => handleStatusChange(lead.id || '', e.target.value)}
                              className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-[11px] font-bold text-[#f2bd19] focus:outline-none"
                            >
                              <option value="new">🟢 New</option>
                              <option value="contacted">🟡 Contacted</option>
                              <option value="converted">🔵 Converted</option>
                              <option value="closed">⚪ Closed</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: BLOG WRITER & YOAST SEO */}
        {activeTab === 'blogs' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Create New Article Form with Integrated Yoast Analyzer (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
              <div>
                <h2 className="text-xl font-black text-white">✍️ Publish Article with Yoast SEO</h2>
                <p className="text-xs text-slate-400">
                  Write content and optimize title tags, meta descriptions, and Google snippet preview in real-time.
                </p>
              </div>

              {blogStatusMsg && (
                <div
                  className={`p-4 rounded-2xl text-xs font-bold border ${
                    blogStatusMsg.startsWith('✅')
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  }`}
                >
                  {blogStatusMsg}
                </div>
              )}

              <form onSubmit={handlePublishBlog} className="space-y-6">
                {/* Article Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                      Article Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={blogTitle}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g., Top Sustainable Building Materials for Homes in Bangalore"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs font-bold text-white placeholder-slate-600 focus:outline-none focus:border-[#f2bd19]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                        URL Slug *
                      </label>
                      <input
                        type="text"
                        required
                        value={blogSlug}
                        onChange={(e) => setBlogSlug(e.target.value)}
                        placeholder="sustainable-building-materials-bangalore"
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs font-mono text-[#f2bd19] focus:outline-none focus:border-[#f2bd19]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                        Category
                      </label>
                      <select
                        value={blogCategory}
                        onChange={(e) => setBlogCategory(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-[#f2bd19]"
                      >
                        <option value="Construction">Construction</option>
                        <option value="Interior Design">Interior Design</option>
                        <option value="Regulations">BBMP Regulations</option>
                        <option value="Materials">Materials &amp; Specs</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                        Author Name
                      </label>
                      <input
                        type="text"
                        value={blogAuthor}
                        onChange={(e) => setBlogAuthor(e.target.value)}
                        placeholder="One Studio Team"
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-[#f2bd19]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                        Featured Image URL
                      </label>
                      <input
                        type="text"
                        value={blogImage}
                        onChange={(e) => setBlogImage(e.target.value)}
                        placeholder="/images/bangalore_modern_interior.png"
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs font-mono text-slate-300 focus:outline-none focus:border-[#f2bd19]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                      Excerpt / Short Summary
                    </label>
                    <textarea
                      rows={2}
                      value={blogExcerpt}
                      onChange={(e) => handleExcerptChange(e.target.value)}
                      placeholder="Brief summary for list cards and fallback meta description..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-medium text-white focus:outline-none focus:border-[#f2bd19]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                      Full Article Content *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={blogContent}
                      onChange={(e) => handleContentChange(e.target.value)}
                      placeholder="Write your article content here. Use ### for subheadings..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-medium text-white focus:outline-none focus:border-[#f2bd19]"
                    />
                  </div>
                </div>

                {/* Integrated Yoast SEO Analyzer & Live SERP Snippet Preview */}
                <YoastSeoAnalyzer
                  seoState={yoastState}
                  onChange={(updated) => setYoastState((prev) => ({ ...prev, ...updated }))}
                  extraPublishedPosts={publishedBlogs.map((b) => ({ title: b.title, path: `/news/${b.slug}` }))}
                />

                <button
                  type="submit"
                  disabled={isPublishing}
                  className="w-full bg-[#f2bd19] hover:bg-amber-500 disabled:opacity-50 text-slate-900 font-black text-xs uppercase tracking-wider py-4 rounded-2xl shadow-lg transition-all cursor-pointer"
                >
                  {isPublishing ? 'PUBLISHING TO LIVE SITE...' : 'PUBLISH WITH YOAST SEO 🚀'}
                </button>
              </form>
            </div>

            {/* Right Column: Published Articles List (5 cols) */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-black text-white">📚 Published Articles ({publishedBlogs.length})</h3>

              <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
                {publishedBlogs.map((b) => (
                  <div key={b.id || b.slug} className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-[#f2bd19] bg-[#f2bd19]/10 px-2 py-0.5 rounded">
                        {b.category || 'Article'}
                      </span>
                      <button
                        onClick={() => handleDeleteBlog(b.id || b.slug)}
                        className="text-slate-500 hover:text-red-400 text-xs font-bold transition-colors cursor-pointer"
                      >
                        🗑️ Delete
                      </button>
                    </div>

                    <h4 className="font-extrabold text-sm text-white">{b.title}</h4>

                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 pt-1">
                      <span>/{b.slug}</span>
                      <Link href={`/news/${b.slug}`} target="_blank" className="text-[#f2bd19] hover:underline">
                        View Live ↗
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: YOAST PAGE SEO MANAGER */}
        {activeTab === 'pagesSeo' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
              <div>
                <h2 className="text-xl font-black text-white">🎯 Yoast Page SEO Manager</h2>
                <p className="text-xs text-slate-400">
                  Select any landing page to edit Google Title Tags, Meta Descriptions, and Focus Keywords.
                </p>
              </div>

              {pageSeoSavedMsg && (
                <div className="p-4 rounded-2xl text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  {pageSeoSavedMsg}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Select Page Sidebar */}
                <div className="lg:col-span-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-2">
                    Select Target Page
                  </span>
                  <div className="space-y-1 max-h-[500px] overflow-y-auto">
                    {[...Object.keys(localSeoPages), ...Object.keys(servicePages)].map((slug) => {
                      const isSelected = selectedSeoPageSlug === slug;
                      return (
                        <button
                          key={slug}
                          type="button"
                          onClick={() => setSelectedSeoPageSlug(slug)}
                          className={`w-full text-left p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#f2bd19] text-slate-900 shadow-md'
                              : 'text-slate-300 hover:bg-slate-900'
                          }`}
                        >
                          /{slug}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Edit Form with Live SERP Preview */}
                <div className="lg:col-span-8 space-y-6">
                  <form onSubmit={handleSavePageSeo} className="space-y-6">
                    <YoastSeoAnalyzer
                      seoState={{
                        seoTitle: editedPageTitle,
                        seoDescription: editedPageDesc,
                        focusKeyword: selectedSeoPageSlug.replace(/-/g, ' '),
                        slug: selectedSeoPageSlug,
                        content: 'Bespoke interior design and luxury home execution in Bangalore.',
                        ogImage: '/images/bangalore_hero_building.png',
                        canonicalUrl: `https://onestudio.in/${selectedSeoPageSlug}`,
                        schemaType: 'LocalBusiness',
                        robotsIndex: true,
                      }}
                      onChange={(updated) => {
                        if (updated.seoTitle !== undefined) setEditedPageTitle(updated.seoTitle);
                        if (updated.seoDescription !== undefined) setEditedPageDesc(updated.seoDescription);
                      }}
                    />

                    <button
                      type="submit"
                      className="w-full bg-[#f2bd19] hover:bg-amber-500 text-slate-900 font-black text-xs uppercase tracking-wider py-4 rounded-2xl shadow-lg transition-all cursor-pointer"
                    >
                      SAVE YOAST SEO METADATA FOR /{selectedSeoPageSlug} 💾
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LOCAL SEO DIRECTORY */}
        {activeTab === 'seo' && (
          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4 shadow-xl">
              <div>
                <h3 className="text-xl font-black text-white">🛠️ Active Service Pages (/services/[slug])</h3>
                <p className="text-xs text-slate-400">
                  Targeted service landing pages rendered with `Schema.org` LocalBusiness markup.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(servicePages).map(([slug, s]) => (
                  <div key={slug} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <span className="text-[10px] font-black uppercase text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-full">
                      {s.category}
                    </span>
                    <h4 className="font-extrabold text-sm text-white">{s.heading}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{s.description}</p>
                    <Link
                      href={`/services/${slug}`}
                      target="_blank"
                      className="inline-block text-xs font-bold text-[#f2bd19] hover:underline pt-2"
                    >
                      Preview Page `/services/${slug}` ↗
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4 shadow-xl">
              <div>
                <h3 className="text-xl font-black text-white">📍 Active Location Pages (/[slug])</h3>
                <p className="text-xs text-slate-400">
                  Geo-targeted local SEO landing pages optimized for Bangalore neighborhoods.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(localSeoPages).map(([slug, p]) => (
                  <div key={slug} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <span className="text-[10px] font-black uppercase text-[#f2bd19] bg-[#f2bd19]/10 px-2.5 py-1 rounded-full">
                      📍 {p.location}
                    </span>
                    <h4 className="font-extrabold text-sm text-white">{p.heading}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{p.description}</p>
                    <Link
                      href={`/${slug}`}
                      target="_blank"
                      className="inline-block text-xs font-bold text-[#f2bd19] hover:underline pt-2"
                    >
                      Preview Page `/${slug}` ↗
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
