"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  HelpCircle,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Accordion } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { toast } from "sonner";

const faqItems = [
  {
    id: "faq-1",
    title: "How do I pay my COLMANS college dues and association dues?",
    content:
      "Log into your student account using your matric number or email. Navigate to the Payment Portal (/payments), select your active session dues (COLMANS College Due and/or your Association Due), and click 'Pay Now' to complete the transaction via Paystack. Your digital receipt is issued immediately.",
  },
  {
    id: "faq-2",
    title: "What departments fall under BASA, NESA, and MATSA?",
    content:
      "BASA covers Business Administration; NESA covers Economics; and MATSA is the joint umbrella body covering Marketing, Accounting & Finance, and Taxation. All students matriculated in these programs are automatic members of their respective association.",
  },
  {
    id: "faq-3",
    title: "Can I download past examination questions without logging in?",
    content:
      "Yes! The Past Questions & Resources Repository (/resources) is open to all students for review and syllabus preparation. You can filter by department, level (100–400), and semester.",
  },
  {
    id: "faq-4",
    title: "How do I run for an executive office in COLMANS or my departmental association?",
    content:
      "Elections are held annually towards the end of the second semester. The Electoral Commission (COLECO) publishes guidelines, eligibility criteria, CGPA requirements, and nomination forms on this website.",
  },
  {
    id: "faq-5",
    title: "What should I do if my bank was debited but my dues status remains unpaid?",
    content:
      "If a transaction fails to verify automatically within 10 minutes, submit a support ticket via this contact form or email the bursary unit at bursar@colmans.edu.ng with your transaction reference number and bank proof of payment.",
  },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (res.ok) {
        toast.success("Message received! The administration will respond shortly.");
        setSubmitted(true);
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        toast.error("Failed to submit message. Please try again.");
      }
    } catch {
      toast.error("Network error submitting form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        {/* Header */}
        <section className="relative py-16 sm:py-24 mesh-gradient border-b border-border">
          <div className="absolute inset-0 grain-overlay" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
            <Badge variant="colmans" className="mb-4">
              Get in Touch
            </Badge>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-text-primary">
              Contact &amp; Student Helpdesk
            </h1>
            <p className="mt-4 text-lg text-text-secondary max-w-2xl">
              Have questions regarding dues, registration, association
              events, or academic resources? Send us a direct message.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-12 lg:grid-cols-12 items-start">
              {/* Left Column: Form */}
              <div className="lg:col-span-7">
                <div className="rounded-2xl bg-bg-secondary border border-border p-8 sm:p-10">
                  <h2 className="font-display text-2xl font-bold text-text-primary mb-2">
                    Send a Message
                  </h2>
                  <p className="text-sm text-text-secondary mb-8">
                    Fill out the form below and the appropriate department or
                    bursary officer will follow up with you.
                  </p>

                  {submitted ? (
                    <div className="text-center py-12 space-y-4">
                      <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                        <CheckCircle2 size={28} />
                      </div>
                      <h3 className="font-display text-xl font-semibold text-text-primary">
                        Message Sent Successfully
                      </h3>
                      <p className="text-xs text-text-secondary max-w-sm mx-auto">
                        Thank you for contacting COLMANS. We have logged your
                        inquiry and will reply to your email address.
                      </p>
                      <Button
                        variant="secondary"
                        onClick={() => setSubmitted(false)}
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Input
                          label="Your Name"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Adebayo Oluwaseun"
                        />
                        <Input
                          label="Email Address"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="student@colmans.edu.ng"
                        />
                      </div>

                      <Input
                        label="Subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. Payment Reconciliation / Resource Request"
                      />

                      <Textarea
                        label="Message"
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="How can we assist you?"
                        rows={5}
                      />

                      <Button
                        type="submit"
                        isLoading={isSubmitting}
                        className="w-full sm:w-auto"
                        size="lg"
                        rightIcon={<Send size={16} />}
                      >
                        Submit Message
                      </Button>
                    </form>
                  )}
                </div>
              </div>

              {/* Right Column: Contact Details & Info */}
              <div className="lg:col-span-5 space-y-6">
                <div className="rounded-2xl bg-bg-secondary border border-border p-8">
                  <h3 className="font-display text-lg font-bold text-text-primary mb-6">
                    Office Details
                  </h3>

                  <ul className="space-y-5">
                    <li className="flex items-start gap-4">
                      <div className="w-9 h-9 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-400 shrink-0">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">
                          Location
                        </p>
                        <p className="text-sm text-text-primary mt-1 leading-relaxed">
                          COLMANS Deanery Building, College of Management
                          Sciences, Bells University of Technology, Ota, Ogun
                          State, Nigeria.
                        </p>
                      </div>
                    </li>

                    <li className="flex items-start gap-4">
                      <div className="w-9 h-9 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-400 shrink-0">
                        <Mail size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">
                          Official Inquiries
                        </p>
                        <p className="text-sm text-text-primary mt-1">
                          cms@bellsuniversity.edu.ng
                        </p>
                        <p className="text-xs text-text-secondary mt-0.5">
                          bursar@colmans.edu.ng (Payments)
                        </p>
                      </div>
                    </li>

                    <li className="flex items-start gap-4">
                      <div className="w-9 h-9 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-400 shrink-0">
                        <Clock size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">
                          Operating Hours
                        </p>
                        <p className="text-sm text-text-primary mt-1">
                          Monday &ndash; Friday: 8:00 AM &ndash; 5:00 PM
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Map preview */}
                <div className="rounded-2xl bg-bg-secondary border border-border overflow-hidden p-6">
                  <h4 className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-3">
                    Campus Map Location
                  </h4>
                  <div className="w-full h-44 rounded-xl bg-bg-tertiary border border-border flex flex-col items-center justify-center text-text-muted text-xs p-4 text-center">
                    <MapPin size={24} className="text-gold-400 mb-2" />
                    <span className="font-semibold text-text-primary">
                      College of Management Sciences (COLMANS)
                    </span>
                    <span className="text-[11px] text-text-muted mt-1">
                      Bells University of Technology Campus, Ota
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Accordion */}
            <div className="mt-20 pt-16 border-t border-border">
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                  <Badge variant="colmans" className="mb-2">
                    Help Center
                  </Badge>
                  <h2 className="font-display text-3xl font-bold text-text-primary">
                    Frequently Asked Questions
                  </h2>
                  <p className="mt-2 text-sm text-text-secondary">
                    Common inquiries about student portal verification, dues,
                    and association activities.
                  </p>
                </div>

                <Accordion items={faqItems} />
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
