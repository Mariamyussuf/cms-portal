"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
    title: "COLMANS Orientation Week",
    date: "Sept 15, 2026",
    time: "9:00 AM",
    venue: "Main Auditorium",
    association: "colmans",
    status: "upcoming",
    description:
      "Welcome ceremony for all new Management Sciences students. Meet your executives, learn about your associations, and kick off the session.",
  },
  {
    id: "2",
    title: "BASA Leadership Summit",
    date: "Oct 5, 2026",
    time: "10:00 AM",
    venue: "Business Block, Room 201",
    association: "basa",
    status: "upcoming",
    description:
      "A day of leadership workshops, case study presentations, and keynote speeches from industry leaders in business administration.",
  },
  {
    id: "3",
    title: "NESA Economics Week",
    date: "Oct 20, 2026",
    time: "All Day",
    venue: "Economics Department",
    association: "nesa",
    status: "upcoming",
    description:
      "A week-long celebration of economic thought — featuring debates, paper presentations, and a career fair with top financial institutions.",
  },
  {
    id: "4",
    title: "MATSA Marketing Challenge",
    date: "Nov 8, 2026",
    time: "2:00 PM",
    venue: "Marketing Lab",
    association: "matsa",
    status: "upcoming",
    description:
      "Inter-departmental marketing pitch competition. Teams will present innovative marketing strategies to a panel of industry judges.",
  },
  {
    id: "5",
    title: "COLMANS End-of-Year Gala",
    date: "Dec 10, 2026",
    time: "6:00 PM",
    venue: "University Hall",
    association: "colmans",
    status: "upcoming",
    description:
      "The annual COLMANS gala night — celebrating achievements, recognizing outstanding students, and ushering in the new year.",
  },
];

const associationBadgeVariant: Record<AssociationKey, "colmans" | "basa" | "nesa" | "matsa"> = {
  colmans: "colmans",
  basa: "basa",
  nesa: "nesa",
  matsa: "matsa",
};

const dotColors: Record<AssociationKey, string> = {
  colmans: "bg-gold-500",
  basa: "bg-basa",
  nesa: "bg-nesa",
  matsa: "bg-matsa",
};

export function EventsTimeline() {
  return (
    <section className="py-20 sm:py-28 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold">
            What&apos;s Happening
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-text-primary">
            Upcoming Events
          </h2>
          <p className="mt-4 text-text-secondary leading-relaxed">
            Stay connected with events across all three associations and COLMANS central.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-8">
            {events.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative pl-12 sm:pl-16"
              >
                {/* Timeline Dot */}
                <div
                  className={`absolute left-2.5 sm:left-4.5 top-2 w-3 h-3 rounded-full ${dotColors[event.association]} ring-4 ring-bg-primary`}
                />

                {/* Event Card */}
                <div className="group rounded-xl p-5 bg-bg-card border border-border hover:border-border-hover transition-all duration-300 hover:shadow-[0_0_20px_rgba(184,134,11,0.08)]">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge variant={associationBadgeVariant[event.association]} dot>
                      {event.association.toUpperCase()}
                    </Badge>
                    <Badge variant={event.status}>{event.status}</Badge>
                  </div>

                  <h3 className="font-display text-lg font-semibold text-text-primary group-hover:text-gold-400 transition-colors">
                    {event.title}
                  </h3>

                  <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                    {event.description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar size={12} />
                      {event.date}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={12} />
                      {event.time}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={12} />
                      {event.venue}
                    </span>
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
