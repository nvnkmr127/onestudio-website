import Link from 'next/link';
import { getPosts, BlogPost } from '@/lib/blogService';

export default async function Blog() {
  const posts: BlogPost[] = await getPosts();

  return (
    <section className="py-24 bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-16">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-[2px] bg-[#f2bd19]"></div>
              <span className="text-[#f2bd19] font-black uppercase tracking-widest text-xs">OUR BLOG &amp; NEWS</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Latest Insights &amp; Articles
            </h2>
          </div>
          <Link
            className="bg-[#f2bd19] text-slate-900 px-8 py-4 rounded-full font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            href="/news"
          >
            VIEW ALL POSTS <span className="bg-slate-900 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              href={`/news/${post.slug}`}
              key={post.id}
              className="block bg-white rounded-[32px] overflow-hidden shadow-sm group border border-slate-200/80 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-64 overflow-hidden">
                  <img
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={post.image}
                  />
                  <div className="absolute bottom-4 right-4 bg-slate-900 text-[#f2bd19] text-[10px] font-black px-3.5 py-1.5 rounded-full uppercase shadow-md">
                    {post.dateStr}
                  </div>
                </div>
                <div className="p-8">
                  {post.category && (
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                      {post.category}
                    </span>
                  )}
                  <h4 className="text-xl font-extrabold text-slate-900 mb-3 group-hover:text-[#f2bd19] transition-colors leading-snug">
                    {post.title}
                  </h4>
                  <p className="text-slate-600 text-sm mb-6 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                </div>
              </div>
              <div className="px-8 pb-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold uppercase text-slate-400">
                <span>👤 {post.author || 'One Studio Team'}</span>
                <span className="text-[#f2bd19] group-hover:translate-x-1 transition-transform">Read Article →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
