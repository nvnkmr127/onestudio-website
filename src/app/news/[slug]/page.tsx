import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import PageHero from '@/components/PageHero';
import Footer from '@/components/Footer';
import { JsonLd } from '@/components/seo/JsonLd';
import { blogPostingSchema, breadcrumbSchema } from '@/lib/schema';
import { getPostBySlug, getPosts } from '@/lib/blogService';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

import { resolveSeo } from '@/lib/seo/resolve';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return resolveSeo(`/news/${slug}`);
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <JsonLd
        data={[
          blogPostingSchema({
            title: post.title,
            publishedDate: post.dateStr,
            featuredImage: { url: post.image },
            slug: post.slug,
            author: post.author,
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'News', path: '/news' },
            { name: post.title, path: `/news/${slug}` },
          ]),
        ]}
      />
      <Header />
      <main className="font-sans">
        <PageHero title={post.title} image={post.image} />
        <article className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-[#f2bd19] text-slate-900 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
                {post.category || 'Article'}
              </span>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                {post.dateStr}
              </span>
            </div>

            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-lg space-y-6">
              {post.content.split('\n\n').map((paragraph, idx) => {
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={idx} className="text-2xl font-black text-slate-900 pt-4 mb-2">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                return <p key={idx}>{paragraph}</p>;
              })}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
