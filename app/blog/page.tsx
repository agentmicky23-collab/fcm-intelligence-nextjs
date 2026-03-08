"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Calendar, User, ArrowRight } from "lucide-react";
import blogPosts from "@/migration-data/blog-posts.json";

export default function Blog() {
  return (
    <AppLayout>
      <div className="pt-32 pb-20 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            Insights & <span className="text-gold">Intelligence</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10">
            Real operator insights from 40+ branches. No theory, just experience.
          </p>

          <div className="space-y-8">
            {blogPosts.map((post) => (
              <article 
                key={post.slug} 
                className="fcm-card group hover:border-gold transition-colors"
              >
                {/* Category Badge */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-block px-3 py-1 bg-gold/20 border border-gold/40 rounded-full text-gold text-xs font-bold uppercase tracking-wider">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar size={12} />
                    {new Date(post.publishedAt).toLocaleDateString("en-GB", { 
                      day: "numeric", 
                      month: "short", 
                      year: "numeric" 
                    })}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-gold transition-colors">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {post.excerpt}
                </p>

                {/* Author & Tags */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User size={14} />
                    <span>{post.author}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span 
                        key={tag} 
                        className="text-xs px-2 py-1 bg-card border border-border rounded text-gray-400"
                      >
                        {tag.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Read More Link */}
                <div className="mt-4 pt-4 border-t border-border">
                  <a 
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-gold hover:text-[#fff0a8] font-semibold text-sm transition-colors"
                  >
                    <span>Read Full Article</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 fcm-card text-center p-12 bg-gold/5 border-gold/30">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Want More <span className="text-gold">Insights</span>?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join FCM Insider for exclusive operator intelligence, market analysis, and early access to premium listings.
            </p>
            <a href="/insiders" className="btn-primary inline-flex items-center gap-2">
              <span>Become an Insider</span>
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
