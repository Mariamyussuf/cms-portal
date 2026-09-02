"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type EventStatus = "upcoming" | "ongoing" | "past";
type AssociationKey = "colmans" | "basa" | "nesa" | "matsa";

interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  association: AssociationKey;
  status: EventStatus;
  description: string;
}

const events: TimelineEvent[] = [
  {
    id: "1",
    title: "COLMANS Academic Orientation & Deanery Welcome",
    date: "Sept 15, 2026",
    time: "9:00 AM",
    venue: "Main Auditorium",
    association: "colmans",
    status: "upcoming",
    description:
      "Welcome ceremony for all new and returning Management Sciences students. Meet collegiate executives, learn about departmental associations, and register for programs.",
  },
  {
    id: "2",
    title: "BASA Executive Leadership Summit",
    date: "Oct 5, 2026",
    time: "10:00 AM",
    venue: "Business Block, Room 201",
    association: "basa",
    status: "upcoming",
    description:
      "A day of leadership workshops, corporate case study challenges, and keynote speeches from industry leaders in business administration.",
  },
  {
    id: "3",
    title: "NESA Macroeconomic Colloquium 2026",
    date: "Oct 20, 2026",
    time: "11:00 AM",
    venue: "COLMANS Lecture Hall A",
    association: "nesa",
    status: "upcoming",
    description:
      "A week-long celebration of economic thought featuring policy debates, paper presentations, and career panels with leading financial institutions.",
  },
  {
    id: "4",
    title: "MATSA Brand & Tax Masterclass",
    date: "Nov 8, 2026",
    time: "2:00 PM",
    venue: "Marketing & Auditing Lab",
    association: "matsa",
    status: "upcoming",
    description:
      "Inter-departmental marketing pitch and corporate taxation workshop. Teams present strategies to a panel of chartered accountants and brand directors.",
  },
];

const dotColors: Record<AssociationKey, string> = {
  colmans: "bg-[#0C2340]",
  basa: "bg-blue-600",
  nesa: "bg-emerald-600",
  matsa: "bg-[#B89758]",
};

export function EventsTimeline() {
  return (
    <section className="py-24 sm:py-32 border-b border-slate-200 bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#0C2340] font-bold">
              COLLEGE CALENDAR
            </span>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0A192F]">
              Upcoming Symposia &amp; Events.
            </h2>
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#0C2340] hover:text-[#1D4ED8]"
          >
            <span>View Full Calendar</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-slate-200" />

          <div className="space-y-8">
            {events.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="relative pl-12 sm:pl-16"
              >
                {/* Timeline Dot */}
                <div
                  className={`absolute left-2.5 sm:left-4.5 top-3 w-3 h-3 rounded-full ${dotColors[event.association]} ring-4 ring-[#F8FAFC] shadow-xs`}
                />

                {/* Event Card */}
                <div className="rounded-2xl p-6 sm:p-8 bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300 shadow-xs hover:shadow-md">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <Badge variant={event.association} dot>
                      {event.association.toUpperCase()}
                    </Badge>
                    <span className="text-xs font-mono text-slate-500">
                      {event.date} &bull; {event.time}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-[#0A192F]">
                    {event.title}
                  </h3>

                  <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-2 text-slate-700">
                      <MapPin size={13} className="text-[#0C2340]" />
                      <span>{event.venue}</span>
                    </div>

                    <Link
                      href="/events"
                      className="inline-flex items-center gap-1.5 font-bold text-[#0C2340] hover:text-[#1D4ED8]"
                    >
                      Reserve Seat
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
