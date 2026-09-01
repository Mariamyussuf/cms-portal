"use client";

import { useState, useEffect } from "react";
import { Plus, FileText, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input, Select } from "@/components/ui/input";
import { toast } from "sonner";

interface Resource {
  id: string;
  title: string;
  courseCode: string;
  departmentName: string;
  level: string;
  semester: string;
  year: string;
}

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form
  const [title, setTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [departmentName, setDepartmentName] = useState("Business Administration");
  const [level, setLevel] = useState("300");
  const [semester, setSemester] = useState("First");
  const [year, setYear] = useState("2025/2026");

  async function loadResources() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/resources");
      if (res.ok) {
        const data = await res.json();
        setResources(data.resources || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load resources.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadResources();
  }, []);

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          courseCode,
          departmentName,
          level,
          semester,
          year,
          fileUrl: "/downloads/sample_pq.pdf",
          fileSize: 2048000,
        }),
      });

      if (res.ok) {
        toast.success("Study material uploaded to repository!");
        setIsModalOpen(false);
        setTitle("");
        setCourseCode("");
        loadResources();
      } else {
        toast.error("Failed to upload resource.");
      }
    } catch {
      toast.error("Network error uploading resource.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary">
            Past Questions &amp; Materials Repository
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Publish examination papers, solutions, and academic syllabus guides
            for student revision.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus size={14} />}
          onClick={() => setIsModalOpen(true)}
        >
          Upload Material
        </Button>
      </div>

      {isLoading ? (
        <div className="min-h-[30vh] flex items-center justify-center">
          <Loader2 className="animate-spin text-gold-400" size={32} />
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-bg-secondary border border-border p-8">
          <FileText size={48} className="text-text-muted mx-auto mb-3" />
          <h3 className="font-display text-lg font-semibold text-text-primary">
            No Study Materials Listed
          </h3>
          <p className="text-xs text-text-secondary mt-1">
            Click &quot;Upload Material&quot; to populate your academic repository.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-bg-secondary border border-border p-6 flex flex-col justify-between"
            >
              <div>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-gold-500/10 text-gold-400 border border-gold-500/20 font-mono">
                  {item.courseCode}
                </span>

                <h3 className="font-display text-base font-bold text-text-primary mt-3">
                  {item.title}
                </h3>
                <p className="text-xs text-text-secondary mt-1">
                  {item.departmentName} &middot; {item.level}L ({item.semester} Semester)
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-text-muted">
                <span>{item.year}</span>
                <span className="text-emerald-400 font-semibold">Active &check;</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload Examination / Course Material"
      >
        <form onSubmit={handleCreateResource} className="space-y-4">
          <Input
            label="Course Code"
            required
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            placeholder="e.g. BUS 301"
          />

          <Input
            label="Resource Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Strategic Management 2022-2025 Past Questions"
          />

          <Select
            label="Department"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            options={[
              { value: "Business Administration", label: "Business Administration" },
              { value: "Economics", label: "Economics" },
              { value: "Accounting & Finance", label: "Accounting & Finance" },
              { value: "Marketing", label: "Marketing" },
            ]}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              options={[
                { value: "100", label: "100 Level" },
                { value: "200", label: "200 Level" },
                { value: "300", label: "300 Level" },
                { value: "400", label: "400 Level" },
              ]}
            />

            <Select
              label="Semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              options={[
                { value: "First", label: "First Semester" },
                { value: "Second", label: "Second Semester" },
              ]}
            />
          </div>

          <Input
            label="Academic Session / Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="2025/2026"
          />

          <div className="pt-4 flex justify-end gap-3 border-t border-border">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              Publish Material
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
