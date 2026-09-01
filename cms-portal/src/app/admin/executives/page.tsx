"use client";

import { useState, useEffect } from "react";
import { Plus, Users, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input, Select } from "@/components/ui/input";
import { toast } from "sonner";

interface Executive {
  id: string;
  name: string;
  position: string;
  photoUrl: string | null;
  association?: {
    name: string;
    fullName: string;
  } | null;
}

export default function AdminExecutivesPage() {
  const [executives, setExecutives] = useState<Executive[]>([]);
  const [associations, setAssociations] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [selectedAssoc, setSelectedAssoc] = useState("basa");
  const [photoUrl, setPhotoUrl] = useState("");

  async function loadData() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/executives");
      if (res.ok) {
        const data = await res.json();
        setExecutives(data.executives || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load executives.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleAddExecutive = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Find association ID or default
      const res = await fetch("/api/executives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          position,
          associationId: selectedAssoc,
          photoUrl: photoUrl || null,
        }),
      });

      if (res.ok) {
        toast.success("Executive profile added!");
        setIsModalOpen(false);
        setName("");
        setPosition("");
        setPhotoUrl("");
        loadData();
      } else {
        toast.error("Failed to add executive.");
      }
    } catch {
      toast.error("Network error adding executive.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary">
            Executive Leadership Manager
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Maintain executive rosters for COLMANS central, BASA, NESA, and
            MATSA.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus size={14} />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Executive Profile
        </Button>
      </div>

      {isLoading ? (
        <div className="min-h-[30vh] flex items-center justify-center">
          <Loader2 className="animate-spin text-gold-400" size={32} />
        </div>
      ) : executives.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-bg-secondary border border-border p-8">
          <Users size={48} className="text-text-muted mx-auto mb-3" />
          <h3 className="font-display text-lg font-semibold text-text-primary">
            No Executive Profiles Found
          </h3>
          <p className="text-xs text-text-secondary mt-1">
            Click &quot;Add Executive Profile&quot; to populate your association leaders.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {executives.map((exec) => (
            <div
              key={exec.id}
              className="rounded-2xl bg-bg-secondary border border-border p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge variant="colmans">
                    {exec.association?.name || "COLMANS"}
                  </Badge>
                </div>

                <div className="w-16 h-16 rounded-full bg-bg-elevated border border-border flex items-center justify-center text-text-muted mb-4">
                  <User size={28} />
                </div>

                <h3 className="font-display text-base font-bold text-text-primary">
                  {exec.name}
                </h3>
                <p className="text-xs text-gold-400 font-semibold mt-0.5">
                  {exec.position}
                </p>
                <p className="text-[11px] text-text-muted mt-1">
                  {exec.association?.fullName || "Collegiate Executive"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Executive Profile"
      >
        <form onSubmit={handleAddExecutive} className="space-y-4">
          <Input
            label="Full Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Oluwaseun Adebayo"
          />

          <Input
            label="Position / Title"
            required
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="e.g. President / Director of Finance"
          />

          <Select
            label="Association"
            value={selectedAssoc}
            onChange={(e) => setSelectedAssoc(e.target.value)}
            options={[
              { value: "basa", label: "BASA (Business Administration)" },
              { value: "nesa", label: "NESA (Economics)" },
              { value: "matsa", label: "MATSA (Marketing/Acc/Tax)" },
            ]}
          />

          <Input
            label="Photo URL (Optional)"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="https://..."
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
              Save Executive
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
