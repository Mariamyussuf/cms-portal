"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Search,
  BookOpen,
  Filter,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { toast } from "sonner";

interface Resource {
  id: string;
  title: string;
  courseCode: string;
  departmentName: string;
  level: string;
  semester: string;
  year: string;
  fileUrl: string;
  fileSize: number;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadResources() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedDept !== "all") params.set("department", selectedDept);
        if (selectedLevel !== "all") params.set("level", selectedLevel);
        if (selectedSemester !== "all") params.set("semester", selectedSemester);

        const res = await fetch(`/api/resources?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setResources(data.resources || []);
        }
      } catch (err) {
        console.error("Failed to load resources:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadResources();
  }, [selectedDept, selectedLevel, selectedSemester]);

  const handleDownload = (res: Resource) => {
    toast.success(`Downloading ${res.courseCode} study package...`);
    // Simulated download prompt
    const link = document.createElement("a");
    link.href = "#";
    link.setAttribute("download", `${res.courseCode}_Past_Questions.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = resources.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.departmentName.toLowerCase().includes(searchQuery.toLowerCase())
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
              Academic Repository
            </Badge>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-text-primary">
              Past Questions &amp; Study Materials
            </h1>
            <p className="mt-4 text-lg text-text-secondary max-w-2xl">
              Access and download syllabus-aligned past examinations, lecture
              notes, case study solutions, and fiscal compendiums.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="bg-bg-secondary rounded-2xl border border-border p-6 mb-10">
              <div className="flex items-center gap-2 text-xs font-semibold text-gold-400 uppercase tracking-wider mb-4">
                <Filter size={14} /> Filter Repository
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Search */}
                <div>
                  <label className="block text-xs text-text-muted mb-1.5">
                    Course Code or Keyword
                  </label>
                  <div className="relative">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="e.g. BUS 301 or Macro"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-bg-tertiary border border-border text-xs text-text-primary focus:outline-none focus:border-gold-500/50"
                    />
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-xs text-text-muted mb-1.5">
                    Department
                  </label>
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-bg-tertiary border border-border text-xs text-text-primary focus:outline-none focus:border-gold-500/50"
                  >
                    <option value="all">All Departments</option>
                    <option value="Business Administration">Business Administration</option>
                    <option value="Economics">Economics</option>
                    <option value="Accounting & Finance">Accounting &amp; Finance</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>

                {/* Level */}
                <div>
                  <label className="block text-xs text-text-muted mb-1.5">
                    Academic Level
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-bg-tertiary border border-border text-xs text-text-primary focus:outline-none focus:border-gold-500/50"
                  >
                    <option value="all">All Levels</option>
                    <option value="100">100 Level</option>
                    <option value="200">200 Level</option>
                    <option value="300">300 Level</option>
                    <option value="400">400 Level</option>
                  </select>
                </div>

                {/* Semester */}
                <div>
                  <label className="block text-xs text-text-muted mb-1.5">
                    Semester
                  </label>
                  <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-bg-tertiary border border-border text-xs text-text-primary focus:outline-none focus:border-gold-500/50"
                  >
                    <option value="all">All Semesters</option>
                    <option value="First">First Semester (Harmattan)</option>
                    <option value="Second">Second Semester (Rain)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* List */}
            {isLoading ? (
              <div className="min-h-[30vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-gold-400" size={32} />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 rounded-2xl bg-bg-secondary border border-border p-10">
                <FileText size={48} className="text-text-muted mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold text-text-primary">
                  No Past Questions Found
                </h3>
                <p className="text-sm text-text-secondary mt-1">
                  Try clearing your filters or searching a different course code.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="rounded-2xl bg-bg-card border border-border p-6 flex flex-col justify-between hover:border-border-hover hover:shadow-[0_0_25px_rgba(184,134,11,0.08)] transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-gold-500/10 text-gold-400 border border-gold-500/20 font-mono">
                          {item.courseCode}
                        </span>
                        <span className="text-[11px] text-text-muted font-medium">
                          {item.year}
                        </span>
                      </div>

                      <h3 className="font-display text-base font-bold text-text-primary leading-snug">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-xs text-text-secondary">
                        {item.departmentName} &middot; {item.level}L ({item.semester} Semester)
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                      <span className="text-xs text-text-muted tabular font-mono">
                        {formatFileSize(item.fileSize)}
                      </span>

                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<Download size={13} />}
                        onClick={() => handleDownload(item)}
                      >
                        Download PDF
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
