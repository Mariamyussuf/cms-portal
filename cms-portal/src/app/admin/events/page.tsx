"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Plus,
  Trash2,
  Edit3,
  MapPin,
  Clock,
  Loader2,
  Users,
  Search,
  Download,
  Filter,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input, Textarea, Select } from "@/components/ui/input";
import { toast } from "sonner";

interface Registration {
  id: string;
  fullName: string;
  email: string;
  matricNumber: string | null;
  level: string | null;
  department: string | null;
  association: string | null;
  createdAt: string;
}

interface EventItem {
  id: string;
  title: string;
  description: string;
  location: string | null;
  startsAt: string;
  endsAt: string | null;
  status: string;
  coverImage: string | null;
  association?: {
    id: string;
    name: string;
    fullName: string;
  } | null;
  _count?: {
    registrations: number;
  };
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [assocFilter, setAssocFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Create / Edit Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [associationId, setAssociationId] = useState("");
  const [status, setStatus] = useState("upcoming");
  const [coverImage, setCoverImage] = useState("");

  // Attendees Modal State
  const [isAttendeesModalOpen, setIsAttendeesModalOpen] = useState(false);
  const [selectedEventForAttendees, setSelectedEventForAttendees] =
    useState<EventItem | null>(null);
  const [attendees, setAttendees] = useState<Registration[]>([]);
  const [isLoadingAttendees, setIsLoadingAttendees] = useState(false);

  // Delete Confirmation State
  const [eventToDelete, setEventToDelete] = useState<EventItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function loadEvents() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load events.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentEventId(null);
    setTitle("");
    setDescription("");
    setLocation("");
    setStartsAt("");
    setEndsAt("");
    setAssociationId("");
    setStatus("upcoming");
    setCoverImage("");
    setIsFormModalOpen(true);
  };

  const openEditModal = (event: EventItem) => {
    setIsEditing(true);
    setCurrentEventId(event.id);
    setTitle(event.title);
    setDescription(event.description);
    setLocation(event.location || "");
    setStartsAt(
      event.startsAt
        ? new Date(event.startsAt).toISOString().slice(0, 16)
        : ""
    );
    setEndsAt(
      event.endsAt
        ? new Date(event.endsAt).toISOString().slice(0, 16)
        : ""
    );
    setAssociationId(event.association?.id || "");
    setStatus(event.status || "upcoming");
    setCoverImage(event.coverImage || "");
    setIsFormModalOpen(true);
  };

  const openAttendeesModal = async (event: EventItem) => {
    setSelectedEventForAttendees(event);
    setIsAttendeesModalOpen(true);
    setIsLoadingAttendees(true);

    try {
      const res = await fetch(`/api/events/${event.id}`);
      if (res.ok) {
        const data = await res.json();
        setAttendees(data.event?.registrations || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load attendee roster.");
    } finally {
      setIsLoadingAttendees(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        title,
        description,
        location,
        startsAt: startsAt ? new Date(startsAt).toISOString() : new Date().toISOString(),
        endsAt: endsAt ? new Date(endsAt).toISOString() : null,
        status,
        associationId: associationId || null,
        coverImage: coverImage || null,
      };

      const url = isEditing
        ? `/api/events/${currentEventId}`
        : "/api/events";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(
          isEditing
            ? "Event updated successfully!"
            : "New event created and published!"
        );
        setIsFormModalOpen(false);
        loadEvents();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to save event.");
      }
    } catch {
      toast.error("Network error saving event.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/events/${eventToDelete.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Event removed from calendar.");
        setEventToDelete(null);
        loadEvents();
      } else {
        toast.error("Failed to delete event.");
      }
    } catch {
      toast.error("Network error deleting event.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportAttendeesCSV = () => {
    if (!selectedEventForAttendees || attendees.length === 0) {
      toast.error("No attendees to export.");
      return;
    }

    const headers = [
      "Full Name",
      "Email",
      "Matric Number",
      "Department",
      "Level",
      "Association",
      "Registration Date",
    ];

    const rows = attendees.map((a) => [
      a.fullName,
      a.email,
      a.matricNumber || "N/A",
      a.department || "N/A",
      a.level || "N/A",
      a.association || "N/A",
      new Date(a.createdAt).toISOString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map(v => `"${v}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `RSVP_${selectedEventForAttendees.title.replace(/[^a-z0-9]/gi, "_")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Attendee list exported as CSV.");
  };

  // Metrics Calculation
  const totalEvents = events.length;
  const totalRSVPs = events.reduce(
    (sum, e) => sum + (e._count?.registrations || 0),
    0
  );
  const upcomingCount = events.filter((e) => e.status === "upcoming").length;
  const pastCount = events.filter((e) => e.status === "past").length;

  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.location && e.location.toLowerCase().includes(searchQuery.toLowerCase()));

    const assocName = e.association?.name || "COLMANS";
    const matchesAssoc =
      assocFilter === "all" ||
      assocName.toLowerCase() === assocFilter.toLowerCase();

    const matchesStatus =
      statusFilter === "all" || e.status === statusFilter;

    return matchesSearch && matchesAssoc && matchesStatus;
  });

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary">
            Events &amp; Symposia Command Center
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Author collegiate conferences, track student RSVPs, export attendee
            rosters, and maintain collegiate calendars.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus size={16} />}
          onClick={openCreateModal}
        >
          Create New Event
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-bg-card border border-border p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-muted">
              Total Scheduled Events
            </span>
            <span className="w-8 h-8 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-400">
              <Calendar size={16} />
            </span>
          </div>
          <p className="mt-3 font-display text-2xl font-bold text-text-primary tabular">
            {totalEvents}
          </p>
          <p className="mt-1 text-[11px] text-text-muted">
            Collegiate &amp; departmental programs
          </p>
        </div>

        <div className="rounded-xl bg-bg-card border border-border p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-muted">
              Total Student RSVPs
            </span>
            <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Users size={16} />
            </span>
          </div>
          <p className="mt-3 font-display text-2xl font-bold text-text-primary tabular">
            {totalRSVPs}
          </p>
          <p className="mt-1 text-[11px] text-text-muted">
            Confirmed registrations logged
          </p>
        </div>

        <div className="rounded-xl bg-bg-card border border-border p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-muted">
              Upcoming Programs
            </span>
            <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Clock size={16} />
            </span>
          </div>
          <p className="mt-3 font-display text-2xl font-bold text-emerald-400 tabular">
            {upcomingCount}
          </p>
          <p className="mt-1 text-[11px] text-text-muted">
            Open for student reservations
          </p>
        </div>

        <div className="rounded-xl bg-bg-card border border-border p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-muted">
              Concluded Programs
            </span>
            <span className="w-8 h-8 rounded-lg bg-bg-elevated flex items-center justify-center text-text-muted">
              <CheckCircle2 size={16} />
            </span>
          </div>
          <p className="mt-3 font-display text-2xl font-bold text-text-primary tabular">
            {pastCount}
          </p>
          <p className="mt-1 text-[11px] text-text-muted">
            Archived collegiate sessions
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-2xl bg-bg-secondary border border-border p-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Association Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "All Bodies" },
              { id: "BASA", label: "BASA" },
              { id: "NESA", label: "NESA" },
              { id: "MATSA", label: "MATSA" },
              { id: "COLMANS", label: "COLMANS Central" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setAssocFilter(tab.id)}
                className={`
                  px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer
                  ${
                    assocFilter === tab.id
                      ? "bg-gold-500 text-bg-primary shadow-lg shadow-gold-500/20"
                      : "bg-bg-tertiary text-text-secondary border border-border hover:border-border-hover hover:text-text-primary"
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search & Status Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg bg-bg-tertiary border border-border px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-gold-500/50"
            >
              <option value="all">All Statuses</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="past">Past / Concluded</option>
            </select>

            <div className="relative flex-1 sm:flex-initial">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search event title, venue..."
                className="pl-9 pr-4 py-2 w-full sm:w-64 rounded-lg bg-bg-tertiary border border-border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold-500/50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="min-h-[35vh] flex items-center justify-center">
          <Loader2 className="animate-spin text-gold-400" size={36} />
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-20 rounded-2xl bg-bg-secondary border border-border p-10">
          <Calendar size={48} className="text-text-muted mx-auto mb-4" />
          <h3 className="font-display text-xl font-semibold text-text-primary">
            No Events Match Your Filters
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Try adjusting your search criteria or click &quot;Create New Event&quot; to publish one.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => {
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
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-bg-secondary border border-border p-6 flex flex-col justify-between hover:border-border-hover hover:shadow-[0_0_25px_rgba(184,134,11,0.06)] transition-all"
              >
                <div>
                  {/* Top Bar Badges */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <Badge variant={assocVariant} dot>
                      {assocName}
                    </Badge>
                    <Badge
                      variant={
                        event.status === "upcoming"
                          ? "upcoming"
                          : event.status === "ongoing"
                            ? "ongoing"
                            : "past"
                      }
                    >
                      {event.status}
                    </Badge>
                  </div>

                  <h3 className="font-display text-lg font-bold text-text-primary leading-snug">
                    {event.title}
                  </h3>
                  <p className="mt-2.5 text-xs text-text-secondary leading-relaxed line-clamp-3">
                    {event.description}
                  </p>
                </div>

                {/* Details & Action Controls */}
                <div className="mt-6 pt-4 border-t border-border space-y-3">
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <Calendar size={13} />
                    <span>
                      {new Date(event.startsAt).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {event.location && (
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <MapPin size={13} />
                      <span className="truncate">{event.location}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                    <button
                      onClick={() => openAttendeesModal(event)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-400 hover:underline cursor-pointer"
                    >
                      <Users size={13} />
                      <span>{event._count?.registrations || 0} RSVPs</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal(event)}
                        className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors cursor-pointer"
                        title="Edit Event"
                      >
                        <Edit3 size={15} />
                      </button>

                      <button
                        onClick={() => setEventToDelete(event)}
                        className="p-1.5 rounded-lg text-text-muted hover:text-error hover:bg-error/10 transition-colors cursor-pointer"
                        title="Delete Event"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Event Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={isEditing ? "Edit Event Program" : "Author New Collegiate Event"}
        size="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Event Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. COLMANS Annual Leadership Colloquium 2026"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Organizing Association"
              value={associationId}
              onChange={(e) => setAssociationId(e.target.value)}
              options={[
                { value: "", label: "COLMANS Central Body" },
                { value: "basa", label: "BASA (Business Administration)" },
                { value: "nesa", label: "NESA (Economics)" },
                { value: "matsa", label: "MATSA (Marketing/Acc/Tax)" },
              ]}
            />

            <Select
              label="Event Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { value: "upcoming", label: "Upcoming (Open for RSVPs)" },
                { value: "ongoing", label: "Ongoing / Happening Now" },
                { value: "past", label: "Past / Concluded" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Start Date & Time"
              type="datetime-local"
              required
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
            />

            <Input
              label="End Date & Time (Optional)"
              type="datetime-local"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
            />
          </div>

          <Input
            label="Location / Hall / Virtual Link"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. COLMANS Deanery Auditorium or Zoom Meeting"
          />

          <Input
            label="Cover Image Banner URL (Optional)"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://..."
          />

          <Textarea
            label="Event Description & Agenda"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide speaker details, schedule breakdown, and eligibility..."
            rows={5}
          />

          <div className="pt-4 flex justify-end gap-3 border-t border-border">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setIsFormModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              {isEditing ? "Save Changes" : "Publish Event"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Attendee Roster Modal */}
      <Modal
        isOpen={isAttendeesModalOpen}
        onClose={() => setIsAttendeesModalOpen(false)}
        title={`Attendee Roster: ${selectedEventForAttendees?.title || "Event"}`}
        size="xl"
      >
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-border">
            <div>
              <p className="text-xs text-text-muted">
                Total Registrations Logged:{" "}
                <strong className="text-text-primary">
                  {attendees.length}
                </strong>
              </p>
            </div>

            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Download size={13} />}
              onClick={handleExportAttendeesCSV}
              disabled={attendees.length === 0}
            >
              Export CSV Roster
            </Button>
          </div>

          {isLoadingAttendees ? (
            <div className="py-12 flex items-center justify-center">
              <Loader2 className="animate-spin text-gold-400" size={28} />
            </div>
          ) : attendees.length === 0 ? (
            <div className="text-center py-12 text-xs text-text-muted">
              No student RSVPs received for this event yet.
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[50vh]">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-bg-secondary">
                  <tr className="border-b border-border text-[11px] font-semibold text-text-muted uppercase">
                    <th className="px-4 py-2.5">Name</th>
                    <th className="px-4 py-2.5">Email</th>
                    <th className="px-4 py-2.5">Matric</th>
                    <th className="px-4 py-2.5">Department</th>
                    <th className="px-4 py-2.5">Level</th>
                    <th className="px-4 py-2.5">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs">
                  {attendees.map((a) => (
                    <tr key={a.id} className="hover:bg-bg-tertiary/40">
                      <td className="px-4 py-3 font-medium text-text-primary">
                        {a.fullName}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">{a.email}</td>
                      <td className="px-4 py-3 font-mono text-text-muted">
                        {a.matricNumber || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {a.department || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-text-muted">{a.level || "N/A"}</td>
                      <td className="px-4 py-3 text-text-muted whitespace-nowrap">
                        {new Date(a.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="pt-4 border-t border-border flex justify-end">
            <Button
              variant="secondary"
              onClick={() => setIsAttendeesModalOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!eventToDelete}
        onClose={() => setEventToDelete(null)}
        title="Confirm Event Deletion"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-error/10 border border-error/20 text-error">
            <AlertTriangle size={20} className="shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              Are you sure you want to delete{" "}
              <strong>&quot;{eventToDelete?.title}&quot;</strong>? This action is
              permanent and will remove all associated attendee reservations.
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-border">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setEventToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteEvent}
              isLoading={isDeleting}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
