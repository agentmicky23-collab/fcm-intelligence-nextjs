"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";

type BlogCategory = 'all' | 'po-insider' | 'uk-strategy' | 'wild-card';

interface BlogPost {
  id: number;
  emoji: string;
  category: BlogCategory;
  categoryLabel: string;
  categoryClass: string;
  date: string;
  title: string;
  excerpt: string;
  readTime: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    emoji: '💼',
    category: 'uk-strategy',
    categoryLabel: 'UK Business Strategy',
    categoryClass: 'bg-blue-500/15 text-blue-400 border border-blue-500',
    date: 'Mar 5, 2026',
    title: 'Why I Turned Down an 850-Site Partnership',
    excerpt: "When the numbers look incredible but the fundamentals don't stack up. The real story behind walking away from a \"once in a lifetime\" opportunity.",
    readTime: '6 min read',
  },
  {
    id: 2,
    emoji: '💷',
    category: 'po-insider',
    categoryLabel: 'PO Insider',
    categoryClass: 'bg-[rgba(255,215,0,0.15)] text-[#FFD700] border border-[#FFD700]',
    date: 'Mar 3, 2026',
    title: 'The Real Cost of Running a Post Office Branch',
    excerpt: "Beyond the broker's listing. The hidden costs every first-time buyer underestimates — and how to budget properly.",
    readTime: '8 min read',
  },
  {
    id: 3,
    emoji: '🔍',
    category: 'uk-strategy',
    categoryLabel: 'UK Business Strategy',
    categoryClass: 'bg-blue-500/15 text-blue-400 border border-blue-500',
    date: 'Mar 1, 2026',
    title: '5 Things Every Acquisition Due Diligence Misses',
    excerpt: "The accountant checks the books. The surveyor checks the building. But who checks the things that actually kill businesses?",
    readTime: '10 min read',
  },
  {
    id: 4,
    emoji: '🚀',
    category: 'po-insider',
    categoryLabel: 'PO Insider',
    categoryClass: 'bg-[rgba(255,215,0,0.15)] text-[#FFD700] border border-[#FFD700]',
    date: 'Feb 28, 2026',
    title: "Post Office Modernisation: What's Actually Changing in 2026",
    excerpt: "New remuneration structure, branch transformation plans, and what it means for operators. The changes no one's talking about.",
    readTime: '12 min read',
  },
];

const categories: { value: BlogCategory; label: string }[] = [
  { value: 'all', label: 'All Posts' },
  { value: 'po-insider', label: 'PO Insider' },
  { value: 'uk-strategy', label: 'UK Business Strategy' },
  { value: 'wild-card', label: 'Wild Card' },
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<BlogCategory>('all');

  const filteredPosts = activeCategory === 'all'
    ? blogPosts
    : blogPosts.filter(p => p.category === activeCategory);

  return (
    <AppLayout>
      {/* Hero */}
      <section className="pt-32 pb-16 text-center" style={{ background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 100%)' }}>
        <div className="container mx-auto px-4">
          <div className="inline-block px-5 py-2 rounded-full mb-6" style={{ background: 'rgba(255, 215, 0, 0.15)', border: '1px solid #FFD700', color: '#FFD700', fontSize: '0.85rem', fontWeight: 600 }}>
            Real Insights from 40 Branches
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Post Office Intelligence</h1>
          <p className="text-xl" style={{ color: '#888888', maxWidth: '700px', margin: '0 auto' }}>
            Expert advice from 15 years of operations. No theory. Just what actually works.
          </p>
        </div>
      </section>

      {/* Category Filters */}
      <section className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-4 my-10">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`filter-btn-old ${activeCategory === cat.value ? 'active' : ''}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Blog Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPosts.map(post => (
              <article key={post.id} className="blog-card-old group">
                {/* Image */}
                <div style={{ width: '100%', height: '200px', background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', borderRadius: '16px 16px 0 0' }}>
                  {post.emoji}
                </div>
                {/* Content */}
                <div style={{ padding: '24px' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`inline-block px-3 py-1 rounded-xl text-xs font-semibold uppercase tracking-wide ${post.categoryClass}`}>
                      {post.categoryLabel}
                    </span>
                    <span style={{ color: '#888888', fontSize: '0.85rem' }}>{post.date}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold mb-3" style={{ lineHeight: 1.3 }}>
                    {post.title}
                  </h3>
                  <p style={{ color: '#888888', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px' }}>
                    {post.excerpt}
                  </p>
                  <div className="flex justify-between items-center pt-4" style={{ borderTop: '1px solid #333333' }}>
                    <span style={{ color: '#888888', fontSize: '0.85rem' }}>{post.readTime}</span>
                    <span style={{ color: '#FFD700', fontWeight: 600, fontSize: '0.9rem' }}>
                      Read More →
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Coming Soon */}
          <div className="text-center py-16">
            <div className="text-6xl mb-5">📝</div>
            <h3 className="text-2xl font-bold mb-3">More Content Coming Soon</h3>
            <p style={{ color: '#888888', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 32px' }}>
              We&apos;re building out the FCM Intelligence blog with real-world insights from 40+ branches. Get notified when new posts go live.
            </p>
            <a href="/contact" className="btn-primary text-lg px-8 py-3">
              Notify Me
            </a>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
