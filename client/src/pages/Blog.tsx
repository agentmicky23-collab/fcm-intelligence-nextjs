import { AppLayout } from "@/components/layout/AppLayout";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { Content } from "@shared/schema";

export default function Blog() {
  const [trackFilter, setTrackFilter] = useState<string | null>(null);

  const { data: posts = [], isLoading } = useQuery<Content[]>({
    queryKey: ["/api/content/published", trackFilter],
    queryFn: async () => {
      const url = trackFilter
        ? `/api/content/published?track=${trackFilter}`
        : "/api/content/published";
      const res = await fetch(url);
      return res.json();
    },
  });

  return (
    <AppLayout>
      <div className="pt-32 pb-20 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            Insights & <span className="text-gold">Intelligence</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10">
            Thought leadership and market analysis from the FCM network.
          </p>

          <div className="flex gap-3 mb-10" data-testid="blog-filters">
            <button
              onClick={() => setTrackFilter(null)}
              className={`text-sm px-4 py-2 rounded-md font-medium transition-colors ${
                !trackFilter ? "bg-gold text-black" : "bg-card border border-border text-muted-foreground hover:text-white"
              }`}
              data-testid="filter-all"
            >
              All
            </button>
            <button
              onClick={() => setTrackFilter("po_insider")}
              className={`text-sm px-4 py-2 rounded-md font-medium transition-colors ${
                trackFilter === "po_insider" ? "bg-gold text-black" : "bg-card border border-border text-muted-foreground hover:text-white"
              }`}
              data-testid="filter-po-insider"
            >
              PO Insider
            </button>
            <button
              onClick={() => setTrackFilter("uk_business_strategy")}
              className={`text-sm px-4 py-2 rounded-md font-medium transition-colors ${
                trackFilter === "uk_business_strategy" ? "bg-gold text-black" : "bg-card border border-border text-muted-foreground hover:text-white"
              }`}
              data-testid="filter-uk-strategy"
            >
              UK Business Strategy
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="fcm-card animate-pulse h-48" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No published articles yet.
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <article key={post.id} className="fcm-card group cursor-pointer" data-testid={`blog-post-${post.id}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-mono font-bold text-gold uppercase tracking-wider">
                      {post.track === "po_insider" ? "PO Insider" : "UK Business Strategy"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {post.contentType === "linkedin" ? "LinkedIn" : "Blog"}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold mb-3 group-hover:text-gold transition-colors" data-testid={`blog-title-${post.id}`}>
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                    {post.body?.substring(0, 250)}...
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>By {post.author}</span>
                    {post.publishedAt && (
                      <span>{new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                    )}
                    <span>{Math.ceil((post.body?.length || 0) / 1000)} min read</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
