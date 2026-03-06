import { DashboardSidebar } from "./DashboardHome";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import type { HrConversation } from "@shared/schema";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Send,
  MessageSquare,
  BookmarkPlus,
  Loader2,
  Scale,
  AlertTriangle,
  FileText,
  ArrowUpRight,
  ShieldCheck,
  Bot,
  User,
} from "lucide-react";

interface ChatMessage {
  role: "user" | "harper";
  content: string;
  timestamp: string;
  structured?: {
    answer: string;
    legalBasis: string;
    procedure: string;
    risk: string;
    docs: string;
    escalation: string;
  };
}

const QUICK_PROMPTS = [
  "An employee has been absent for 5 days without notice. What should I do?",
  "How do I handle a grievance raised against a manager?",
  "What's the process for a disciplinary hearing?",
  "Can I dismiss someone during their probation period?",
  "An employee is requesting flexible working arrangements.",
  "How do I manage a long-term sickness absence?",
];

function generateHarperResponse(question: string): NonNullable<ChatMessage["structured"]> {
  const q = question.toLowerCase();

  if (q.includes("absent") || q.includes("absence") || q.includes("awol")) {
    return {
      answer:
        "Unauthorised absence should be treated as a potential conduct issue. Begin with welfare checks before escalating to formal procedures. Document all attempts to contact the employee.",
      legalBasis:
        "Employment Rights Act 1996, Section 98 — Fair reasons for dismissal include conduct. ACAS Code of Practice on Disciplinary and Grievance Procedures applies.",
      procedure:
        "1. Attempt to contact the employee by phone and in writing within 24 hours.\n2. Send a formal letter requesting return to work within 48 hours.\n3. If no response after 5 working days, issue an invitation to a formal meeting.\n4. Consider welfare referral if there are known health concerns.\n5. Follow your absence management policy before any disciplinary action.",
      risk: "MEDIUM — Dismissing without proper investigation could lead to unfair dismissal claim. Ensure all welfare steps are evidenced.",
      docs: "Absence Policy, Disciplinary Procedure, ACAS Guide on Managing Attendance",
      escalation:
        "If the absence exceeds 2 weeks with no contact, escalate to senior management. If there are safeguarding concerns, contact the relevant authorities immediately.",
    };
  }

  if (q.includes("grievance")) {
    return {
      answer:
        "A grievance should be handled promptly and fairly. The employee has the right to raise concerns and have them investigated. Appoint an impartial investigator who is not involved in the complaint.",
      legalBasis:
        "Employment Rights Act 1996. ACAS Code of Practice on Disciplinary and Grievance Procedures. Equality Act 2010 if discrimination is alleged.",
      procedure:
        "1. Acknowledge the grievance in writing within 5 working days.\n2. Appoint an impartial investigating officer.\n3. Arrange a formal grievance hearing within 10 working days.\n4. Allow the employee to be accompanied by a colleague or trade union representative.\n5. Provide a written outcome within 5 working days of the hearing.\n6. Offer the right of appeal.",
      risk: "HIGH — Grievances against managers can indicate systemic issues. Mishandling may result in constructive dismissal claims or tribunal proceedings.",
      docs: "Grievance Policy, ACAS Code of Practice, Equality Act 2010 Guidance",
      escalation:
        "If the grievance involves allegations of harassment or discrimination, escalate immediately to HR Director. Consider suspending the alleged perpetrator if necessary.",
    };
  }

  if (q.includes("disciplinary")) {
    return {
      answer:
        "A disciplinary hearing must follow a fair and transparent process. The employee must be given adequate notice, details of the allegations, and the right to be accompanied.",
      legalBasis:
        "Employment Rights Act 1996, Section 98. ACAS Code of Practice on Disciplinary and Grievance Procedures. Human Rights Act 1998, Article 6 (right to a fair hearing).",
      procedure:
        "1. Complete a thorough investigation before any hearing.\n2. Write to the employee setting out the allegations and evidence.\n3. Give at least 5 working days' notice of the hearing.\n4. Allow the employee to be accompanied.\n5. Hold the hearing, hear the employee's case, and adjourn to consider the decision.\n6. Communicate the outcome in writing with the right of appeal.",
      risk: "HIGH — Failure to follow ACAS Code can result in a 25% uplift in tribunal compensation. Ensure procedural fairness throughout.",
      docs: "Disciplinary Policy, ACAS Code of Practice, Investigation Report Template",
      escalation:
        "If the case involves potential gross misconduct, consider suspension on full pay during investigation. Consult with legal counsel before dismissal.",
    };
  }

  if (q.includes("probation")) {
    return {
      answer:
        "Yes, you can dismiss during probation, but you must still follow a fair process. Even during probation, the employee has certain rights, and after 2 years' service they gain full unfair dismissal protection.",
      legalBasis:
        "Employment Rights Act 1996. Employees with less than 2 years' service cannot normally claim ordinary unfair dismissal, but can claim for automatically unfair reasons (e.g., discrimination, whistleblowing).",
      procedure:
        "1. Review the employment contract for probation terms.\n2. Hold a probation review meeting.\n3. Clearly outline performance concerns with examples.\n4. Offer support and set clear targets with a review date.\n5. If dismissing, provide the contractual notice period.\n6. Confirm the decision in writing.",
      risk: "LOW — Provided you avoid discriminatory grounds and follow contractual terms, risk is low. However, always document your reasons.",
      docs: "Probation Policy, Employment Contract, Performance Review Template",
      escalation:
        "If the employee raises a discrimination claim or is pregnant/on maternity leave, seek immediate legal advice before proceeding.",
    };
  }

  if (q.includes("flexible") || q.includes("working from home") || q.includes("remote")) {
    return {
      answer:
        "All employees with 26 weeks' service have the statutory right to request flexible working. From April 2024, this right applies from day one of employment. You must handle the request in a reasonable manner.",
      legalBasis:
        "Employment Rights Act 1996, Section 80F. Flexible Working Regulations 2014. Employment Relations (Flexible Working) Act 2023.",
      procedure:
        "1. Acknowledge the request within 5 working days.\n2. Arrange a meeting to discuss the request within 28 days.\n3. Consider the request carefully against business needs.\n4. You may only refuse on one of the 8 statutory business grounds.\n5. Provide a written decision within 2 months of the request.\n6. If refusing, explain which business ground applies and why.",
      risk: "MEDIUM — Refusing without proper consideration may lead to tribunal claims. Indirect discrimination risk if refusal disproportionately affects a protected group.",
      docs: "Flexible Working Policy, ACAS Guide to Flexible Working, Request Form Template",
      escalation:
        "If the request relates to a disability or caring responsibility, consider reasonable adjustments under the Equality Act 2010 before refusing.",
    };
  }

  if (q.includes("sickness") || q.includes("sick") || q.includes("long-term")) {
    return {
      answer:
        "Long-term sickness absence requires a careful balance between supporting the employee and managing business needs. Obtain medical evidence and consider reasonable adjustments before any capability proceedings.",
      legalBasis:
        "Employment Rights Act 1996. Equality Act 2010 (disability discrimination). Access to Medical Reports Act 1988. Duty to make reasonable adjustments.",
      procedure:
        "1. Maintain regular welfare contact (at least every 2 weeks).\n2. Refer to Occupational Health for a medical assessment.\n3. Hold a formal sickness review meeting after 4 weeks' absence.\n4. Consider reasonable adjustments (phased return, modified duties).\n5. If return is not foreseeable, follow capability procedure.\n6. Ensure all meetings offer the right to be accompanied.",
      risk: "HIGH — If the condition qualifies as a disability under the Equality Act, failure to make reasonable adjustments could result in significant tribunal awards.",
      docs: "Sickness Absence Policy, Occupational Health Referral Form, Equality Act 2010 Guidance",
      escalation:
        "If the employee's condition is stress-related or linked to workplace issues, investigate the root cause. Consider referral to Employee Assistance Programme.",
    };
  }

  return {
    answer:
      "Based on your query, I recommend reviewing the relevant company policies and ACAS guidance. Every situation should be handled on its merits with proper documentation and fair process.",
    legalBasis:
      "Employment Rights Act 1996. ACAS Code of Practice on Disciplinary and Grievance Procedures. Equality Act 2010 where applicable.",
    procedure:
      "1. Gather all relevant facts and documentation.\n2. Review the applicable company policy.\n3. Consult with the employee and hear their perspective.\n4. Consider any mitigating circumstances.\n5. Make a decision and communicate it in writing.\n6. Offer the right of appeal.",
    risk: "MEDIUM — Ensure you follow fair procedures and document all steps to mitigate tribunal risk.",
    docs: "Company Handbook, ACAS Guidance, Relevant Company Policy",
    escalation:
      "If the matter involves potential legal liability or significant financial risk, seek specialist employment law advice before proceeding.",
  };
}

function classifyQuestion(question: string): { caseType: string; riskLevel: string } {
  const q = question.toLowerCase();
  if (q.includes("disciplinary") || q.includes("dismiss") || q.includes("gross misconduct"))
    return { caseType: "Disciplinary", riskLevel: "high" };
  if (q.includes("grievance") || q.includes("complaint") || q.includes("harassment"))
    return { caseType: "Grievance", riskLevel: "high" };
  if (q.includes("tribunal") || q.includes("legal") || q.includes("claim"))
    return { caseType: "Tribunal Risk", riskLevel: "high" };
  if (q.includes("absent") || q.includes("sick") || q.includes("absence"))
    return { caseType: "Absence Management", riskLevel: "medium" };
  if (q.includes("flexible") || q.includes("probation") || q.includes("contract"))
    return { caseType: "General Query", riskLevel: "low" };
  return { caseType: "General Query", riskLevel: "medium" };
}

export default function DashboardHrCases() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { data: conversations = [] } = useQuery<HrConversation[]>({
    queryKey: ["/api/hr/conversations"],
    queryFn: () => fetch("/api/hr/conversations").then((r) => r.json()),
  });

  const createConversation = useMutation({
    mutationFn: (data: { title?: string; caseType?: string; riskLevel?: string; messages?: ChatMessage[] }) =>
      apiRequest("POST", "/api/hr/conversations", data),
    onSuccess: async (result) => {
      queryClient.invalidateQueries({ queryKey: ["/api/hr/conversations"] });
      setActiveConversationId(result.id);
    },
  });

  const updateConversation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<HrConversation> }) =>
      apiRequest("PATCH", `/api/hr/conversations/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hr/conversations"] });
    },
  });

  const saveCaseMutation = useMutation({
    mutationFn: (id: number) => apiRequest("POST", `/api/hr/conversations/${id}/save-case`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hr"] });
    },
  });

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [localMessages, isThinking, scrollToBottom]);

  useEffect(() => {
    if (activeConversationId) {
      const conv = conversations.find((c) => c.id === activeConversationId);
      if (conv && Array.isArray(conv.messages)) {
        setLocalMessages(conv.messages as ChatMessage[]);
      }
    }
  }, [activeConversationId, conversations]);

  const handleSend = async (text?: string) => {
    const message = text || inputValue.trim();
    if (!message || isThinking) return;
    setInputValue("");

    const userMsg: ChatMessage = {
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...localMessages, userMsg];
    setLocalMessages(newMessages);
    setIsThinking(true);

    const classification = classifyQuestion(message);

    if (!activeConversationId) {
      const title = message.length > 60 ? message.substring(0, 57) + "..." : message;
      try {
        const conv = await createConversation.mutateAsync({
          title,
          caseType: classification.caseType,
          riskLevel: classification.riskLevel,
          messages: newMessages,
        });

        setTimeout(() => {
          const structured = generateHarperResponse(message);
          const harperMsg: ChatMessage = {
            role: "harper",
            content: structured.answer,
            timestamp: new Date().toISOString(),
            structured,
          };
          const allMessages = [...newMessages, harperMsg];
          setLocalMessages(allMessages);
          setIsThinking(false);
          updateConversation.mutate({
            id: conv.id,
            data: { messages: allMessages as any },
          });
        }, 2000);
      } catch {
        setIsThinking(false);
      }
    } else {
      updateConversation.mutate({
        id: activeConversationId,
        data: { messages: newMessages as any, caseType: classification.caseType, riskLevel: classification.riskLevel },
      });

      setTimeout(() => {
        const structured = generateHarperResponse(message);
        const harperMsg: ChatMessage = {
          role: "harper",
          content: structured.answer,
          timestamp: new Date().toISOString(),
          structured,
        };
        const allMessages = [...newMessages, harperMsg];
        setLocalMessages(allMessages);
        setIsThinking(false);
        updateConversation.mutate({
          id: activeConversationId,
          data: { messages: allMessages as any },
        });
      }, 2000);
    }
  };

  const startNewConversation = () => {
    setActiveConversationId(null);
    setLocalMessages([]);
    setInputValue("");
    inputRef.current?.focus();
  };

  const filteredConversations = conversations.filter((c) =>
    !searchTerm || (c.title && c.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const riskColor = (r: string | null) => {
    if (r === "high") return "text-red-400 bg-red-500/10";
    if (r === "medium") return "text-yellow-400 bg-yellow-500/10";
    return "text-green-400 bg-green-500/10";
  };

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (ts: string | Date | null) => {
    if (!ts) return "";
    const d = new Date(ts);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 86400000) return "Today";
    if (diff < 172800000) return "Yesterday";
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  const activeConv = conversations.find((c) => c.id === activeConversationId);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <DashboardSidebar active="/dashboard/hr" />
      <div className="flex-1 flex overflow-hidden h-screen">
        <aside className="w-80 border-r border-border flex flex-col bg-card" data-testid="conversation-list-panel">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Bot size={20} className="text-gold" /> Ask Harper
              </h2>
              <button
                onClick={startNewConversation}
                className="p-2 rounded-md hover:bg-gold/10 text-gold transition-colors"
                data-testid="button-new-conversation"
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background border border-border rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                data-testid="input-search-conversations"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground text-sm">
                <MessageSquare size={32} className="mx-auto mb-3 opacity-50" />
                <p>No conversations yet</p>
                <p className="text-xs mt-1">Start a new conversation with Harper</p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`w-full text-left p-4 border-b border-border hover:bg-background/50 transition-colors ${
                    activeConversationId === conv.id ? "bg-background border-l-2 border-l-gold" : ""
                  }`}
                  data-testid={`conversation-item-${conv.id}`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="font-medium text-sm line-clamp-1 flex-1 mr-2">
                      {conv.title || "New Conversation"}
                    </span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(conv.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {conv.caseType && (
                      <span className="text-xs text-muted-foreground">{conv.caseType}</span>
                    )}
                    {conv.riskLevel && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${riskColor(conv.riskLevel)}`}>
                        {conv.riskLevel.toUpperCase()}
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        <main className="flex-1 flex flex-col" data-testid="chat-panel">
          {activeConversationId || localMessages.length > 0 ? (
            <>
              <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card">
                <div>
                  <h1 className="font-bold text-lg" data-testid="text-chat-title">
                    {activeConv?.title || "New Conversation"}
                  </h1>
                  <div className="flex items-center gap-3 mt-0.5">
                    {activeConv?.caseType && (
                      <span className="text-xs text-muted-foreground">{activeConv.caseType}</span>
                    )}
                    {activeConv?.riskLevel && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${riskColor(activeConv.riskLevel)}`}>
                        {activeConv.riskLevel.toUpperCase()} RISK
                      </span>
                    )}
                  </div>
                </div>
                {activeConversationId && (
                  <button
                    onClick={() => saveCaseMutation.mutate(activeConversationId)}
                    disabled={saveCaseMutation.isPending}
                    className="btn-secondary text-xs h-8 px-3 gap-1.5"
                    data-testid="button-save-as-case"
                  >
                    <BookmarkPlus size={14} />
                    {saveCaseMutation.isPending ? "Saving..." : "Save as Case"}
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4" data-testid="chat-messages">
                {localMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    data-testid={`chat-message-${i}`}
                  >
                    {msg.role === "harper" && (
                      <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot size={16} className="text-gold" />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] ${
                        msg.role === "user"
                          ? "bg-gold text-black rounded-2xl rounded-br-md px-4 py-3"
                          : "bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <p className="text-sm">{msg.content}</p>
                      ) : msg.structured ? (
                        <div className="space-y-3">
                          <p className="text-sm leading-relaxed">{msg.structured.answer}</p>

                          <div className="bg-background rounded-lg p-3 border border-border space-y-3">
                            <div className="flex items-start gap-2">
                              <Scale size={14} className="text-gold mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="text-xs font-bold text-gold block mb-0.5">Legal Basis</span>
                                <p className="text-xs text-muted-foreground leading-relaxed">{msg.structured.legalBasis}</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-2">
                              <FileText size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="text-xs font-bold text-blue-400 block mb-0.5">Procedure</span>
                                <p className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">{msg.structured.procedure}</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-2">
                              <AlertTriangle size={14} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="text-xs font-bold text-yellow-400 block mb-0.5">Risk Assessment</span>
                                <p className="text-xs text-muted-foreground leading-relaxed">{msg.structured.risk}</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-2">
                              <ShieldCheck size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="text-xs font-bold text-green-400 block mb-0.5">Relevant Documents</span>
                                <p className="text-xs text-muted-foreground leading-relaxed">{msg.structured.docs}</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-2">
                              <ArrowUpRight size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="text-xs font-bold text-red-400 block mb-0.5">Escalation</span>
                                <p className="text-xs text-muted-foreground leading-relaxed">{msg.structured.escalation}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm">{msg.content}</p>
                      )}
                      <span className="text-[10px] text-muted-foreground mt-1 block text-right">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                    {msg.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-1">
                        <User size={16} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}

                {isThinking && (
                  <div className="flex gap-3 justify-start" data-testid="harper-thinking">
                    <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot size={16} className="text-gold" />
                    </div>
                    <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 size={14} className="animate-spin text-gold" />
                        Harper is thinking...
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-border bg-card">
                <div className="flex gap-2">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Ask Harper an HR question..."
                    rows={1}
                    className="flex-1 bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
                    data-testid="input-chat-message"
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!inputValue.trim() || isThinking}
                    className="btn-primary h-auto px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid="button-send-message"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8" data-testid="chat-empty-state">
              <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mb-6">
                <Bot size={40} className="text-gold" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Ask Harper</h2>
              <p className="text-muted-foreground text-center max-w-md mb-8">
                Your AI HR advisor. Ask any employment law or HR question and get structured guidance with legal basis, procedures, and risk assessment.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full">
                {QUICK_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="text-left p-4 bg-card border border-border rounded-lg hover:border-gold/50 transition-colors text-sm text-muted-foreground hover:text-white group"
                    data-testid={`quick-prompt-${i}`}
                  >
                    <MessageSquare size={14} className="text-gold mb-2 group-hover:scale-110 transition-transform" />
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
