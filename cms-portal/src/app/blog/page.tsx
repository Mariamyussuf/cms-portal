"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  User,
  Share2,
  ArrowRight,
  Loader2,
  Tag,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { toast } from "sonner";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: string;
  publishedAt: string | null;
  authorName: string | null;
  coverImage: string | null;
  association?: {
    name: string;
    fullName: string;
  } | null;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeAssoc, setActiveAssoc] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    async function loadPosts() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeCategory !== "all") params.set("category", activeCategory);
        if (activeAssoc !== "all") params.set("association", activeAssoc);

        const res = await fetch(`/api/blog?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts || []);
        }
      } catch (err) {
        console.error("Failed to load blog posts:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadPosts();
  }, [activeCategory, activeAssoc]);

  const handleShare = (post: BlogPost) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
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
              News &amp; Editorial
            </Badge>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-text-primary">
              COLMANS Gazette
            </h1>
            <p className="mt-4 text-lg text-text-secondary max-w-2xl">
              Academic bulletins, student success stories, policy research
              summaries, and association updates.
            </p>
          </div>
        </section>

        {/* Filters & Grid */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            {/* Categories */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-border">
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: "all", label: "All Topics" },
                  { id: "Academic", label: "Academic" },
                  { id: "Career", label: "Career & Fintech" },
                  { id: "Social", label: "Campus Life" },
                  { id: "General", label: "Announcements" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`
                      px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer
                      ${
                        activeCategory === cat.id
                          ? "bg-gold-500 text-bg-primary shadow-lg shadow-gold-500/20"
                          : "bg-bg-secondary text-text-secondary border border-border hover:border-border-hover hover:text-text-primary"
                      }
                    `}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Association Filter */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-text-muted">Association:</span>
                <select
                  value={activeAssoc}
                  onChange={(e) => setActiveAssoc(e.target.value)}
                  className="rounded-lg bg-bg-secondary border border-border px-3 py-2 text-xs text-text-primary focus:outline-none"
                >
                  <option value="all">All Associations</option>
                  <option value="BASA">BASA</option>
                  <option value="NESA">NESA</option>
                  <option value="MATSA">MATSA</option>
                </select>
              </div>
            </div>

            {/* Posts Grid */}
            {isLoading ? (
              <div className="min-h-[30vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-gold-400" size={32} />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 rounded-2xl bg-bg-secondary border border-border p-10">
                <BookOpen size={48} className="text-text-muted mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold text-text-primary">
                  No Articles Found
                </h3>
                <p className="text-sm text-text-secondary mt-1">
                  Check back soon for new publications from our editorial team.
                </p>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, i) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="rounded-2xl bg-bg-card border border-border overflow-hidden flex flex-col justify-between hover:border-border-hover hover:shadow-[0_0_25px_rgba(184,134,11,0.08)] transition-all group cursor-pointer"
                    onClick={() => setSelectedPost(post)}
                  >
                    <div>
                      {/* Image placeholder or banner */}
                      <div className="h-48 bg-gradient-to-br from-bg-tertiary via-bg-secondary to-bg-tertiary border-b border-border p-6 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-bg-elevated/80 border border-border text-gold-400">
                            {post.category}
                          </span>
                          {post.association && (
                            <Badge variant="colmans">
                              {post.association.name}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-text-muted">
                          <Clock size={12} />
                          <span>3 min read</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h2 className="font-display text-lg font-bold text-text-primary group-hover:text-gold-400 transition-colors leading-snug line-clamp-2">
                          {post.title}
                        </h2>
                        <p className="mt-2.5 text-xs sm:text-sm text-text-secondary leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 pt-0 flex items-center justify-between text-xs text-text-muted border-t border-border mt-4">
                      <span className="flex items-center gap-1.5">
                        <User size={12} />
                        {post.authorName || "Editorial Board"}
                      </span>
                      <span className="text-gold-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        Read <ArrowRight size={12} />
                      </span>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Reader Modal */}
        <Modal
          isOpen={!!selectedPost}
          onClose={() => setSelectedPost(null)}
          size="lg"
          title={selectedPost?.title}
        >
          {selectedPost && (
            <div className="space-y-6">
              {/* Meta bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border text-xs text-text-muted">
                <div className="flex items-center gap-3">
                  <Badge variant="colmans">{selectedPost.category}</Badge>
                  <span>By {selectedPost.authorName || "COLMANS Editorial"}</span>
                  {selectedPost.publishedAt && (
                    <span>
                      &middot;{" "}
                      {new Date(selectedPost.publishedAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleShare(selectedPost)}
                  className="inline-flex items-center gap-1 text-gold-400 hover:underline cursor-pointer"
                >
                  <Share2 size={13} />
                  Share
                </button>
              </div>

              {/* Excerpt */}
              <p className="text-sm font-medium text-text-primary italic bg-bg-tertiary/50 p-4 rounded-xl border border-border">
                {selectedPost.excerpt}
              </p>

              {/* Body */}
              <div className="text-sm text-text-secondary leading-relaxed space-y-4">
                {selectedPost.body.split("\n\n").map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              <div className="pt-4 border-t border-border flex justify-end">
                <Button
                  variant="secondary"
                  onClick={() => setSelectedPost(null)}
                >
                  Close Article
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </main>
      <SiteFooter />
    </>
  );
}
