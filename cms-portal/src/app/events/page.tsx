"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input, Select } from "@/components/ui/input";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { toast } from "sonner";

interface EventItem {
  id: string;
  title: string;
  description: string;
  location: string | null;
  startsAt: string;
  endsAt: string | null;
  status: string;
  association?: {
    name: string;
    fullName: string;
  } | null;
  _count?: {
    registrations: number;
  };
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [activeAssoc, setActiveAssoc] = useState("all");
  const [activeStatus, setActiveStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Registration modal state
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [formFullName, setFormFullName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMatric, setFormMatric] = useState("");
  const [formLevel, setFormLevel] = useState("100");
  const [formDept, setFormDept] = useState("Business Administration");
  const [formAssoc, setFormAssoc] = useState("BASA");

  useEffect(() => {
    async function loadEvents() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeAssoc !== "all") params.set("association", activeAssoc);
        if (activeStatus !== "all") params.set("status", activeStatus);

        const res = await fetch(`/api/events?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setEvents(data.events || []);
        }
      } catch (err) {
        console.error("Failed to load events:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadEvents();
  }, [activeAssoc, activeStatus]);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    setIsRegistering(true);

    try {
      const res = await fetch(`/api/events/${selectedEvent.id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formFullName,
          email: formEmail,
          matricNumber: formMatric,
          level: formLevel,
          department: formDept,
          association: formAssoc,
        }),
      });

      if (res.ok) {
        toast.success(`Registered successfully for ${selectedEvent.title}!`);
        setSelectedEvent(null);
        // Reset form
        setFormFullName("");
        setFormEmail("");
        setFormMatric("");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch {
      toast.error("Network error submitting registration.");
    } finally {
      setIsRegistering(false);
    }
  };

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        {/* Header */}
        <section className="relative py-16 sm:py-24 mesh-gradient border-b border-border">
          <div className="absolute inset-0 grain-overlay" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
            <Badge variant="colmans" className="mb-4">
              College Calendar
            </Badge>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-text-primary">
              Events &amp; Programs
            </h1>
            <p className="mt-4 text-lg text-text-secondary max-w-2xl">
              Symposiums, academic colloquiums, leadership challenges, and
              social galas across COLMANS, BASA, NESA, and MATSA.
            </p>
          </div>
        </section>

        {/* Filters & Content */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            {/* Filter controls */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 pb-6 border-b border-border">
              {/* Association Tabs */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: "all", label: "All Events" },
                  { id: "BASA", label: "BASA" },
                  { id: "NESA", label: "NESA" },
                  { id: "MATSA", label: "MATSA" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveAssoc(tab.id)}
                    className={`
                      px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer
                      ${
                        activeAssoc === tab.id
                          ? "bg-gold-500 text-bg-primary shadow-lg shadow-gold-500/20"
                          : "bg-bg-secondary text-text-secondary border border-border hover:border-border-hover hover:text-text-primary"
                      }
                    `}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Status & Search */}
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={activeStatus}
                  onChange={(e) => setActiveStatus(e.target.value)}
                  className="rounded-lg bg-bg-secondary border border-border px-3 py-2 text-xs text-text-primary focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past Events</option>
                </select>

                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search events..."
                    className="pl-9 pr-4 py-2 rounded-lg bg-bg-secondary border border-border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold-500/50"
                  />
                </div>
              </div>
            </div>

            {/* Event Grid */}
            {isLoading ? (
              <div className="min-h-[30vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-gold-400" size={32} />
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-20 rounded-2xl bg-bg-secondary border border-border p-10">
                <Calendar size={48} className="text-text-muted mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold text-text-primary">
                  No Events Found
                </h3>
                <p className="text-sm text-text-secondary mt-1">
                  Try adjusting your association or search filters.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map((event, i) => {
                  const assocName = event.association?.name || "COLMANS";
                  const assocVariant =
                    assocName === "BASA"
                      ? "basa"
                      : assocName === "NESA"
                        ? "nesa"
                        : assocName === "MATSA"
                          ? "matsa"
                          : "colmans";

                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className="rounded-2xl bg-bg-card border border-border p-6 flex flex-col justify-between hover:border-border-hover hover:shadow-[0_0_25px_rgba(184,134,11,0.08)] transition-all"
                    >
                      <div>
                        {/* Badges */}
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <Badge variant={assocVariant} dot>
                            {assocName}
                          </Badge>
                          <Badge
                            variant={
                              event.status === "upcoming"
                                ? "upcoming"
                                : "past"
                            }
                          >
                            {event.status}
                          </Badge>
                        </div>

                        <h3 className="font-display text-lg font-bold text-text-primary hover:text-gold-400 transition-colors">
                          {event.title}
                        </h3>
                        <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed line-clamp-3">
                          {event.description}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-border space-y-2">
                        <div className="flex items-center gap-2 text-xs text-text-muted">
                          <Calendar size={13} />
                          <span>
                            {new Date(event.startsAt).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>

                        {event.location && (
                          <div className="flex items-center gap-2 text-xs text-text-muted">
                            <MapPin size={13} />
                            <span>{event.location}</span>
                          </div>
                        )}

                        <div className="pt-3 flex items-center justify-between">
                          <span className="text-[11px] text-text-muted flex items-center gap-1">
                            <Users size={12} />
                            {event._count?.registrations || 0} registered
                          </span>

                          {event.status === "upcoming" ? (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => setSelectedEvent(event)}
                            >
                              Register
                            </Button>
                          ) : (
                            <span className="text-xs text-text-muted">
                              Concluded
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Event Registration Modal */}
        <Modal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title={`Register: ${selectedEvent?.title || "Event"}`}
        >
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <p className="text-xs text-text-secondary mb-4">
              Enter your student details to reserve your seat for this event.
            </p>

            <Input
              label="Full Name"
              required
              value={formFullName}
              onChange={(e) => setFormFullName(e.target.value)}
              placeholder="e.g. Adebayo Oluwaseun"
            />

            <Input
              label="Email Address"
              type="email"
              required
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              placeholder="student@colmans.edu.ng"
            />

            <Input
              label="Matric Number"
              value={formMatric}
              onChange={(e) => setFormMatric(e.target.value)}
              placeholder="e.g. BU/20A/0001"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Level"
                value={formLevel}
                onChange={(e) => setFormLevel(e.target.value)}
                options={[
                  { value: "100", label: "100 Level" },
                  { value: "200", label: "200 Level" },
                  { value: "300", label: "300 Level" },
                  { value: "400", label: "400 Level" },
                  { value: "PG", label: "Postgraduate" },
                ]}
              />

              <Select
                label="Association"
                value={formAssoc}
                onChange={(e) => setFormAssoc(e.target.value)}
                options={[
                  { value: "BASA", label: "BASA (Business Admin)" },
                  { value: "NESA", label: "NESA (Economics)" },
                  { value: "MATSA", label: "MATSA (Marketing/Acc/Tax)" },
                ]}
              />
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-border">
              <Button
                variant="ghost"
                type="button"
                onClick={() => setSelectedEvent(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                isLoading={isRegistering}
              >
                Confirm Registration
              </Button>
            </div>
          </form>
        </Modal>
      </main>
      <SiteFooter />
    </>
  );
}
