import { DashboardSidebar } from "./DashboardHome";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import type { HrCase } from "@shared/schema";
import { useState } from "react";
import { Plus, X, AlertTriangle, CheckCircle, Clock, ArrowUpRight } from "lucide-react";

export default function DashboardHrCases() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [selectedCase, setSelectedCase] = useState<HrCase | null>(null);
  const [form, setForm] = useState({ caseType: "", description: "", riskLevel: "medium" });

  const { data: cases = [] } = useQuery<HrCase[]>({
    queryKey: ["/api/hr"],
    queryFn: () => fetch("/api/hr").then(r => r.json()),
  });

  const createCase = useMutation({
    mutationFn: (data: typeof form) => apiRequest("POST", "/api/hr", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hr"] });
      setShowForm(false);
      setForm({ caseType: "", description: "", riskLevel: "medium" });
    },
  });

  const riskBadge = (r: string | null) => {
    if (r === "high") return "text-red-400 bg-red-500/10";
    if (r === "medium") return "text-yellow-400 bg-yellow-500/10";
    return "text-green-400 bg-green-500/10";
  };

  const outcomeBadge = (o: string | null) => {
    if (o === "resolved") return { icon: <CheckCircle size={14} />, color: "text-green-400" };
    if (o === "escalated") return { icon: <ArrowUpRight size={14} />, color: "text-red-400" };
    if (o === "ongoing") return { icon: <Clock size={14} />, color: "text-yellow-400" };
    return { icon: <Clock size={14} />, color: "text-muted-foreground" };
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <DashboardSidebar active="/dashboard/hr" />
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">HR Cases</h1>
          <button onClick={() => setShowForm(true)} className="btn-primary text-sm" data-testid="button-new-hr-case">
            <Plus size={16} className="mr-2" /> New HR Query
          </button>
        </div>

        <div className="space-y-3">
          {cases.map((c) => {
            const ob = outcomeBadge(c.outcome);
            return (
              <div
                key={c.id}
                className="bg-card border border-border rounded-lg p-5 hover:border-gold/50 transition-colors cursor-pointer"
                onClick={() => setSelectedCase(c)}
                data-testid={`hr-case-${c.id}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold">{c.caseType}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${riskBadge(c.riskLevel)}`}>
                      {c.riskLevel?.toUpperCase()} RISK
                    </span>
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${ob.color}`}>
                    {ob.icon}
                    {c.outcome?.toUpperCase() || "PENDING"}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{c.description}</p>
                <div className="mt-3 text-xs text-muted-foreground">
                  {c.createdAt && new Date(c.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              </div>
            );
          })}
        </div>

        {/* New Case Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <div className="bg-card border border-border rounded-xl max-w-lg w-full p-8" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">New HR Query</h2>
                <button onClick={() => setShowForm(false)} className="hover:text-gold"><X size={20} /></button>
              </div>
              <form onSubmit={e => { e.preventDefault(); createCase.mutate(form); }} className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Case Type</label>
                  <select value={form.caseType} onChange={e => setForm({ ...form, caseType: e.target.value })} required className="w-full bg-background border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" data-testid="select-case-type">
                    <option value="">Select type</option>
                    <option value="Disciplinary">Disciplinary</option>
                    <option value="Grievance">Grievance</option>
                    <option value="Tribunal Risk">Tribunal Risk</option>
                    <option value="Absence Management">Absence Management</option>
                    <option value="General Query">General Query</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Risk Level</label>
                  <select value={form.riskLevel} onChange={e => setForm({ ...form, riskLevel: e.target.value })} className="w-full bg-background border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50" data-testid="select-risk-level">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Description</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required rows={4} className="w-full bg-background border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none" data-testid="input-hr-description" />
                </div>
                <button type="submit" className="btn-primary w-full" disabled={createCase.isPending} data-testid="button-submit-hr">
                  {createCase.isPending ? "Submitting..." : "Submit to Harper"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Case Detail Modal */}
        {selectedCase && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedCase(null)}>
            <div className="bg-card border border-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedCase.caseType}</h2>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${riskBadge(selectedCase.riskLevel)}`}>
                    {selectedCase.riskLevel?.toUpperCase()} RISK
                  </span>
                </div>
                <button onClick={() => setSelectedCase(null)} className="hover:text-gold"><X size={20} /></button>
              </div>

              <div className="mb-6">
                <h3 className="font-bold mb-2 text-gold">Description</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{selectedCase.description}</p>
              </div>

              {selectedCase.guidance && (
                <div className="mb-6 bg-background border border-gold/30 rounded-lg p-4">
                  <h3 className="font-bold mb-2 text-gold flex items-center gap-2">
                    <AlertTriangle size={16} /> Harper's Guidance
                  </h3>
                  <p className="text-sm leading-relaxed">{selectedCase.guidance}</p>
                </div>
              )}

              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>Status: {selectedCase.outcome?.toUpperCase() || "PENDING"}</span>
                <span>Opened: {selectedCase.createdAt && new Date(selectedCase.createdAt).toLocaleDateString("en-GB")}</span>
                {selectedCase.resolvedAt && <span>Resolved: {new Date(selectedCase.resolvedAt).toLocaleDateString("en-GB")}</span>}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
