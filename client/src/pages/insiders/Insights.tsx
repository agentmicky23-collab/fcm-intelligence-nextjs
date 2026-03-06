import { InsidersSidebar } from "./InsidersHome";
import { useQuery } from "@tanstack/react-query";
import type { Content } from "@shared/schema";
import { useState } from "react";

export default function InsiderInsights() {
  const [trackFilter, setTrackFilter] = useState<string | null>(null);

  const { data: posts = [], isLoading } = useQuery<Content[]>({
    queryKey: ["/api/content/published", trackFilter],
    queryFn: async () => {
      const url = trackFilter ? `/api/content/published?track=${trackFilter}` : "/api/content/published";
      return fetch(url).then(r => r.json());
    },
  });

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <InsidersSidebar active="/insiders/insights" />
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-2">Insights Library</h1>
        <p className="text-muted-foreground mb-8">Exclusive analysis and thought leadership from the FCM network.</p>

        <div className="flex gap-3 mb-8">
          {[null, "po_insider", "uk_business_strategy"].map((t) => (
            <button
              key={t || "all"}
              onClick={() => setTrackFilter(t)}
              className={`text-sm px-4 py-2 rounded-md font-medium transition-colors ${
                trackFilter === t ? "bg-gold text-black" : "bg-card border border-border text-muted-foreground hover:text-white"
              }`}
            >
              {t === null ? "All" : t === "po_insider" ? "PO Insider" : "UK Business Strategy"}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="fcm-card animate-pulse h-32" />)}</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No insights published yet.</div>
        ) : (
          <div className="space-y-6">
            {posts.map(post => (
              <article key={post.id} className="fcm-card group cursor-pointer" data-testid={`insight-${post.id}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-mono font-bold text-gold uppercase tracking-wider">
                    {post.track === "po_insider" ? "PO Insider" : "UK Business Strategy"}
                  </span>
                  <span className="text-xs text-muted-foreground">{post.contentType}</span>
                </div>
                <h2 className="text-xl font-bold mb-2 group-hover:text-gold transition-colors">{post.title}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">{post.body?.substring(0, 300)}...</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>By {post.author}</span>
                  <span>{Math.ceil((post.body?.length || 0) / 1000)} min read</span>
                  {post.publishedAt && <span>{new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
