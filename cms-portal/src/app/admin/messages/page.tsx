"use client";

import { useState, useEffect } from "react";
import { Mail, Users, CheckCircle2, Circle, Clock, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [activeTab, setActiveTab] = useState<"messages" | "subscribers">(
    "messages",
  );
  const [isLoading, setIsLoading] = useState(true);

  async function loadData() {
    setIsLoading(true);
    try {
      const [msgRes, subRes] = await Promise.all([
        fetch("/api/admin/messages"),
        fetch("/api/admin/subscribers"),
      ]);

      if (msgRes.ok) {
        const msgData = await msgRes.json();
        setMessages(msgData.messages || []);
      }

      if (subRes.ok) {
        const subData = await subRes.json();
        setSubscribers(subData.subscribers || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load inquiries and subscribers.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const toggleRead = async (msg: Message) => {
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: msg.id, isRead: !msg.isRead }),
      });

      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, isRead: !m.isRead } : m)),
        );
        toast.success(msg.isRead ? "Marked as unread" : "Marked as read");
      }
    } catch {
      toast.error("Failed to update status.");
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary">
          Inquiries &amp; Newsletter Audience
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Review direct student helpdesk messages and subscriber lists.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-4">
        <button
          onClick={() => setActiveTab("messages")}
          className={`
            px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2
            ${
              activeTab === "messages"
                ? "bg-gold-500 text-bg-primary shadow-lg shadow-gold-500/20"
                : "bg-bg-secondary text-text-secondary border border-border"
            }
          `}
        >
          <Mail size={14} />
          Messages ({messages.filter((m) => !m.isRead).length} unread)
        </button>

        <button
          onClick={() => setActiveTab("subscribers")}
          className={`
            px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2
            ${
              activeTab === "subscribers"
                ? "bg-gold-500 text-bg-primary shadow-lg shadow-gold-500/20"
                : "bg-bg-secondary text-text-secondary border border-border"
            }
          `}
        >
          <Users size={14} />
          Subscribers ({subscribers.length})
        </button>
      </div>

      {isLoading ? (
        <div className="min-h-[30vh] flex items-center justify-center">
          <Loader2 className="animate-spin text-gold-400" size={32} />
        </div>
      ) : activeTab === "messages" ? (
        messages.length === 0 ? (
          <div className="text-center py-16 rounded-2xl bg-bg-secondary border border-border p-8 text-xs text-text-muted">
            No contact inquiries logged.
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`rounded-2xl border p-6 transition-all ${
                  msg.isRead
                    ? "bg-bg-secondary border-border opacity-70"
                    : "bg-bg-card border-gold-500/30 shadow-[0_0_15px_rgba(184,134,11,0.05)]"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleRead(msg)}
                      className="text-gold-400 hover:text-gold-300 cursor-pointer"
                      title={msg.isRead ? "Mark unread" : "Mark read"}
                    >
                      {msg.isRead ? (
                        <CheckCircle2 size={18} className="text-emerald-400" />
                      ) : (
                        <Circle size={18} className="text-gold-400" />
                      )}
                    </button>
                    <div>
                      <h3 className="font-display text-sm font-bold text-text-primary">
                        {msg.subject}
                      </h3>
                      <p className="text-xs text-text-muted">
                        From: <span className="text-text-primary">{msg.name}</span> ({msg.email})
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] text-text-muted">
                    {new Date(msg.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <p className="mt-3 text-xs sm:text-sm text-text-secondary leading-relaxed bg-bg-tertiary/40 p-4 rounded-xl border border-border">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
        )
      ) : subscribers.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-bg-secondary border border-border p-8 text-xs text-text-muted">
          No newsletter subscribers yet.
        </div>
      ) : (
        <div className="rounded-2xl bg-bg-secondary border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border text-[11px] font-semibold text-text-muted uppercase">
                  <th className="px-6 py-3.5">Subscriber Email</th>
                  <th className="px-6 py-3.5">Subscribed Date</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {subscribers.map((s) => (
                  <tr key={s.id} className="hover:bg-bg-tertiary/30">
                    <td className="px-6 py-4 font-medium text-text-primary">
                      {s.email}
                    </td>
                    <td className="px-6 py-4 text-text-muted">
                      {new Date(s.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                        Subscribed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
