import { DashboardSidebar } from "./DashboardHome";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import type { Content } from "@shared/schema";
import { CheckCircle, Edit, XCircle } from "lucide-react";

export default function ContentPipeline() {
  const queryClient = useQueryClient();
  const { data: items = [] } = useQuery<Content[]>({
    queryKey: ["/api/content"],
    queryFn: () => fetch("/api/content").then(r => r.json()),
  });

  const updateContent = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      apiRequest("PATCH", `/api/content/${id}`, { status, ...(status === "published" ? { publishedAt: new Date().toISOString() } : {}) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/content"] }),
  });

  const stages = [
    { key: "draft", label: "Draft" },
    { key: "review", label: "Rex Review" },
    { key: "approval", label: "Your Approval" },
    { key: "published", label: "Published" },
  ];

  const byStage = (stage: string) => items.filter(i => i.status === stage);

  const verdictBadge = (v: string | null) => {
    if (v === "pass") return "text-green-400 bg-green-500/10";
    if (v === "conditional_pass") return "text-yellow-400 bg-yellow-500/10";
    return "text-red-400 bg-red-500/10";
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <DashboardSidebar active="/dashboard/content" />
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-8">Content Pipeline</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stages.map((stage) => (
            <div key={stage.key}>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="font-bold text-sm tracking-wider uppercase text-muted-foreground">{stage.label}</h2>
                <span className="font-financial text-xs bg-card border border-border rounded px-2 py-0.5">{byStage(stage.key).length}</span>
              </div>
              <div className="space-y-3">
                {byStage(stage.key).map((item) => (
                  <div key={item.id} className="bg-card border border-border rounded-lg p-4 hover:border-gold/50 transition-colors" data-testid={`content-card-${item.id}`}>
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-mono text-gold uppercase">{item.contentType}</span>
                      {item.rexVerdict && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${verdictBadge(item.rexVerdict)}`}>
                          {item.rexVerdict.replace("_", " ")}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm mb-2 leading-tight">{item.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span>By {item.author}</span>
                      {item.rexScore !== null && <span className="font-financial">Score: {item.rexScore}</span>}
                    </div>

                    {stage.key === "approval" && (
                      <div className="flex gap-2 pt-2 border-t border-border">
                        <button
                          onClick={() => updateContent.mutate({ id: item.id, status: "published" })}
                          className="flex-1 btn-primary text-xs py-1.5 min-h-0 h-auto flex items-center justify-center gap-1"
                          data-testid={`button-approve-${item.id}`}
                        >
                          <CheckCircle size={14} /> Approve
                        </button>
                        <button
                          onClick={() => updateContent.mutate({ id: item.id, status: "draft" })}
                          className="flex-1 text-xs py-1.5 text-red-400 border border-red-500/30 rounded-md hover:bg-red-500/10 transition-colors flex items-center justify-center gap-1"
                          data-testid={`button-reject-${item.id}`}
                        >
                          <XCircle size={14} /> Return
                        </button>
                      </div>
                    )}

                    {stage.key === "review" && (
                      <div className="flex gap-2 pt-2 border-t border-border">
                        <button
                          onClick={() => updateContent.mutate({ id: item.id, status: "approval" })}
                          className="flex-1 btn-secondary text-xs py-1.5 min-h-0 h-auto"
                          data-testid={`button-move-approval-${item.id}`}
                        >
                          Move to Approval
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {byStage(stage.key).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm border border-dashed border-border rounded-lg">
                    No items
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
