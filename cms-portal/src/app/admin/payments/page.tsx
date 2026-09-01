"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Download,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Settings,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input, Select } from "@/components/ui/input";
import { toast } from "sonner";

interface Payment {
  id: string;
  reference: string;
  amountKobo: number;
  currency: string;
  status: string;
  feeType: string | null;
  provider: string;
  createdAt: string;
  student?: {
    matricNumber: string;
    firstName: string;
    lastName: string;
    department?: { name: string };
    level: string;
  } | null;
  receipt?: { receiptNo: string } | null;
}

interface FeeStructure {
  id: string;
  label: string;
  category: string;
  amountKobo: number;
  session: string;
  isActive: boolean;
}

interface AssociationDue {
  id: string;
  label: string;
  amountKobo: number;
  session: string;
  isActive: boolean;
  association?: { name: string };
}

function formatKobo(kobo: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(kobo / 100);
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [collegeFees, setCollegeFees] = useState<FeeStructure[]>([]);
  const [associationDues, setAssociationDues] = useState<AssociationDue[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchMatric, setSearchMatric] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Manual payment modal
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualMatric, setManualMatric] = useState("");
  const [manualFeeType, setManualFeeType] = useState("COLMANS College Due");
  const [manualAmount, setManualAmount] = useState("5000");
  const [manualMethod, setManualMethod] = useState("Bank Transfer");
  const [manualNotes, setManualNotes] = useState("");
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);

  // Fee configuration modal
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<{
    id?: string;
    type: "COLLEGE_DUE" | "ASSOCIATION_DUE";
    label: string;
    amount: string;
    session: string;
  }>({
    type: "COLLEGE_DUE",
    label: "COLMANS College Due",
    amount: "5000",
    session: "2026/2027",
  });
  const [isSavingFee, setIsSavingFee] = useState(false);

  async function loadData() {
    setIsLoading(true);
    try {
      const [payRes, feeRes] = await Promise.all([
        fetch(`/api/admin/payments?status=${statusFilter}`),
        fetch("/api/admin/fees"),
      ]);

      if (payRes.ok) {
        const payData = await payRes.json();
        setPayments(payData.payments || []);
      }

      if (feeRes.ok) {
        const feeData = await feeRes.json();
        setCollegeFees(feeData.collegeFees || []);
        setAssociationDues(feeData.associationDues || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load payment management records.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleExportCSV = () => {
    if (payments.length === 0) {
      toast.error("No records to export.");
      return;
    }

    const headers = [
      "Reference",
      "Payer Name",
      "Matric Number",
      "Department",
      "Level",
      "Fee Description",
      "Amount (NGN)",
      "Status",
      "Date",
      "Receipt No",
    ];

    const rows = payments.map((p) => [
      p.reference,
      p.student ? `${p.student.firstName} ${p.student.lastName}` : "Unknown",
      p.student?.matricNumber || "N/A",
      p.student?.department?.name || "N/A",
      p.student?.level || "N/A",
      p.feeType || "College Due",
      (p.amountKobo / 100).toFixed(2),
      p.status,
      new Date(p.createdAt).toISOString(),
      p.receipt?.receiptNo || "N/A",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map(val => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `COLMANS_Payments_Report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Payments report downloaded as CSV.");
  };

  const handleManualPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingManual(true);

    try {
      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matricNumber: manualMatric,
          feeType: manualFeeType,
          amountKobo: Math.round(parseFloat(manualAmount) * 100),
          method: manualMethod,
          notes: manualNotes,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Payment recorded and receipt issued!");
        setIsManualModalOpen(false);
        setManualMatric("");
        setManualNotes("");
        loadData();
      } else {
        toast.error(data.error || "Failed to record manual payment.");
      }
    } catch {
      toast.error("Network error recording payment.");
    } finally {
      setIsSubmittingManual(false);
    }
  };

  const handleFeeSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingFee(true);

    try {
      const res = await fetch("/api/admin/fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingFee.id,
          type: editingFee.type,
          label: editingFee.label,
          amountKobo: Math.round(parseFloat(editingFee.amount) * 100),
          academicSession: editingFee.session,
          isActive: true,
        }),
      });

      if (res.ok) {
        toast.success("Fee structure updated successfully!");
        setIsFeeModalOpen(false);
        loadData();
      } else {
        toast.error("Failed to update fee.");
      }
    } catch {
      toast.error("Network error saving fee configuration.");
    } finally {
      setIsSavingFee(false);
    }
  };

  const filteredPayments = payments.filter((p) => {
    const term = searchMatric.toLowerCase();
    const matric = p.student?.matricNumber?.toLowerCase() || "";
    const name = `${p.student?.firstName || ""} ${p.student?.lastName || ""}`.toLowerCase();
    const ref = p.reference.toLowerCase();
    return matric.includes(term) || name.includes(term) || ref.includes(term);
  });

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary">
            Payments &amp; Bursary Operations
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Audit transactions, manually reconcile bank receipts, export CSV
            reports, and configure session fee rates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Download size={14} />}
            onClick={handleExportCSV}
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={() => setIsManualModalOpen(true)}
          >
            Record Manual Payment
          </Button>
        </div>
      </div>

      {/* Fee Structures Configuration Bar */}
      <div className="rounded-2xl bg-bg-secondary border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Settings size={18} className="text-gold-400" />
            <h2 className="font-display text-base font-bold text-text-primary">
              Session Fee Schedules (2026/2027)
            </h2>
          </div>
          <span className="text-xs text-text-muted">
            Rates applied across student checkouts
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {collegeFees.map((f) => (
            <div
              key={f.id}
              className="p-4 rounded-xl bg-bg-card border border-border flex items-center justify-between"
            >
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">
                  COLMANS Central
                </p>
                <p className="text-sm font-bold text-text-primary mt-0.5">
                  {formatKobo(f.amountKobo)}
                </p>
                <p className="text-[10px] text-text-muted">{f.session}</p>
              </div>
              <button
                onClick={() => {
                  setEditingFee({
                    id: f.id,
                    type: "COLLEGE_DUE",
                    label: f.label,
                    amount: (f.amountKobo / 100).toString(),
                    session: f.session,
                  });
                  setIsFeeModalOpen(true);
                }}
                className="text-xs text-gold-400 hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>
          ))}

          {associationDues.map((a) => (
            <div
              key={a.id}
              className="p-4 rounded-xl bg-bg-card border border-border flex items-center justify-between"
            >
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">
                  {a.association?.name || "Association"} Due
                </p>
                <p className="text-sm font-bold text-text-primary mt-0.5">
                  {formatKobo(a.amountKobo)}
                </p>
                <p className="text-[10px] text-text-muted">{a.session}</p>
              </div>
              <button
                onClick={() => {
                  setEditingFee({
                    id: a.id,
                    type: "ASSOCIATION_DUE",
                    label: a.label,
                    amount: (a.amountKobo / 100).toString(),
                    session: a.session,
                  });
                  setIsFeeModalOpen(true);
                }}
                className="text-xs text-gold-400 hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Records */}
      <div className="rounded-2xl bg-bg-secondary border border-border overflow-hidden">
        {/* Controls */}
        <div className="p-6 border-b border-border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "All Payments" },
              { id: "SUCCESSFUL", label: "Successful" },
              { id: "PENDING", label: "Pending" },
              { id: "FAILED", label: "Failed" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`
                  px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer
                  ${
                    statusFilter === tab.id
                      ? "bg-gold-500 text-bg-primary shadow-lg shadow-gold-500/20"
                      : "bg-bg-tertiary text-text-secondary border border-border hover:border-border-hover"
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              value={searchMatric}
              onChange={(e) => setSearchMatric(e.target.value)}
              placeholder="Search matric, name or ref..."
              className="pl-9 pr-4 py-2 rounded-lg bg-bg-tertiary border border-border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-gold-500/50"
            />
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="min-h-[30vh] flex items-center justify-center">
            <Loader2 className="animate-spin text-gold-400" size={32} />
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-12 text-center text-xs text-text-muted">
            No payments matched your search or status filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border text-[11px] font-semibold text-text-muted uppercase">
                  <th className="px-6 py-3.5">Reference</th>
                  <th className="px-6 py-3.5">Student / Matric</th>
                  <th className="px-6 py-3.5">Department</th>
                  <th className="px-6 py-3.5">Fee Description</th>
                  <th className="px-6 py-3.5">Amount</th>
                  <th className="px-6 py-3.5">Gateway</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-bg-tertiary/30">
                    <td className="px-6 py-4 font-mono text-[11px] text-text-muted">
                      {p.reference}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-text-primary">
                        {p.student
                          ? `${p.student.firstName} ${p.student.lastName}`
                          : "Unknown"}
                      </p>
                      <p className="text-[11px] text-text-muted font-mono">
                        {p.student?.matricNumber || "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {p.student?.department?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-text-primary">
                      {p.feeType || "College Due"}
                    </td>
                    <td className="px-6 py-4 font-bold text-text-primary tabular">
                      {formatKobo(p.amountKobo)}
                    </td>
                    <td className="px-6 py-4 text-text-muted">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-bg-elevated border border-border">
                        {p.provider}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          p.status === "SUCCESSFUL"
                            ? "paid"
                            : p.status === "FAILED"
                              ? "error"
                              : "warning"
                        }
                        dot
                      >
                        {p.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-text-muted tabular whitespace-nowrap">
                      {new Date(p.createdAt).toLocaleDateString("en-NG", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual Payment Recording Modal */}
      <Modal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        title="Record Bank Transfer / Cash Payment"
      >
        <form onSubmit={handleManualPaymentSubmit} className="space-y-4">
          <p className="text-xs text-text-secondary">
            Issue an official receipt for a payment made directly via bank
            deposit or bursary counter.
          </p>

          <Input
            label="Student Matric Number"
            required
            value={manualMatric}
            onChange={(e) => setManualMatric(e.target.value)}
            placeholder="e.g. BU/20A/0001"
          />

          <Select
            label="Fee Description"
            value={manualFeeType}
            onChange={(e) => setManualFeeType(e.target.value)}
            options={[
              { value: "COLMANS College Due", label: "COLMANS College Due (₦5,000)" },
              { value: "BASA Association Annual Due", label: "BASA Annual Due (₦3,000)" },
              { value: "NESA Association Annual Due", label: "NESA Annual Due (₦3,000)" },
              { value: "MATSA Association Annual Due", label: "MATSA Annual Due (₦3,000)" },
              { value: "Combined College & Association Dues", label: "Combined Dues (₦8,000)" },
            ]}
          />

          <Input
            label="Amount Paid (NGN)"
            type="number"
            required
            value={manualAmount}
            onChange={(e) => setManualAmount(e.target.value)}
            placeholder="5000"
          />

          <Select
            label="Payment Method"
            value={manualMethod}
            onChange={(e) => setManualMethod(e.target.value)}
            options={[
              { value: "Bank Transfer", label: "Bank Direct Transfer" },
              { value: "Cash Counter", label: "Bursary Cash Counter" },
              { value: "POS Machine", label: "Campus POS Terminal" },
            ]}
          />

          <Input
            label="Bank Reference / Teller Number / Notes"
            value={manualNotes}
            onChange={(e) => setManualNotes(e.target.value)}
            placeholder="e.g. Stanbic IBTC Ref 98472910"
          />

          <div className="pt-4 flex justify-end gap-3 border-t border-border">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setIsManualModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={isSubmittingManual}
            >
              Issue Receipt &amp; Mark Paid
            </Button>
          </div>
        </form>
      </Modal>

      {/* Fee Rate Editing Modal */}
      <Modal
        isOpen={isFeeModalOpen}
        onClose={() => setIsFeeModalOpen(false)}
        title={`Edit ${editingFee.label}`}
      >
        <form onSubmit={handleFeeSave} className="space-y-4">
          <Input
            label="Fee Label"
            required
            value={editingFee.label}
            onChange={(e) =>
              setEditingFee({ ...editingFee, label: e.target.value })
            }
          />

          <Input
            label="Amount (NGN)"
            type="number"
            required
            value={editingFee.amount}
            onChange={(e) =>
              setEditingFee({ ...editingFee, amount: e.target.value })
            }
          />

          <Input
            label="Academic Session"
            required
            value={editingFee.session}
            onChange={(e) =>
              setEditingFee({ ...editingFee, session: e.target.value })
            }
          />

          <div className="pt-4 flex justify-end gap-3 border-t border-border">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setIsFeeModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSavingFee}>
              Save Fee Rate
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
