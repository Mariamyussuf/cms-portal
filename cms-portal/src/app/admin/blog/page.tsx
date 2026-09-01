"use client";

import { useState, useEffect } from "react";
import { Plus, BookOpen, Clock, Loader2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input, Textarea, Select } from "@/components/ui/input";
import { toast } from "sonner";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  status: string;
  authorName: string | null;
  publishedAt: string | null;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Academic");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

  async function loadPosts() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/blog");
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load blog posts.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          excerpt,
          body: content,
          status: "PUBLISHED",
        }),
      });

      if (res.ok) {
        toast.success("Blog article published!");
        setIsModalOpen(false);
        setTitle("");
        setExcerpt("");
        setContent("");
        loadPosts();
      } else {
        toast.error("Failed to publish post.");
      }
    } catch {
      toast.error("Network error publishing post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary">
            Blog &amp; Gazette Editor
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Publish academic bulletins, student success stories, and collegiate
            announcements.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus size={14} />}
          onClick={() => setIsModalOpen(true)}
        >
          New Publication
        </Button>
      </div>

      {isLoading ? (
        <div className="min-h-[30vh] flex items-center justify-center">
          <Loader2 className="animate-spin text-gold-400" size={32} />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-bg-secondary border border-border p-8">
          <BookOpen size={48} className="text-text-muted mx-auto mb-3" />
          <h3 className="font-display text-lg font-semibold text-text-primary">
            No Blog Articles Published
          </h3>
          <p className="text-xs text-text-secondary mt-1">
            Click &quot;New Publication&quot; to write your first article.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="rounded-2xl bg-bg-secondary border border-border p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge variant="colmans">{post.category}</Badge>
                  <span className="text-[10px] text-text-muted">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : "Draft"}
                  </span>
                </div>

                <h3 className="font-display text-base font-bold text-text-primary leading-snug">
                  {post.title}
                </h3>
                <p className="mt-2 text-xs text-text-secondary line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-text-muted">
                <span>By {post.authorName || "Editorial"}</span>
                <span className="text-gold-400 text-[11px] font-semibold">
                  Published &check;
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Article Creation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Publish New Article"
        size="lg"
      >
        <form onSubmit={handleCreatePost} className="space-y-4">
          <Input
            label="Article Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Dean Announces New Fintech Laboratory"
          />

          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
              { value: "Academic", label: "Academic Bulletin" },
              { value: "Career", label: "Career & Fintech" },
              { value: "Social", label: "Campus Life & Association" },
              { value: "General", label: "General Notice" },
            ]}
          />

          <Textarea
            label="Excerpt / Brief Summary"
            required
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Short 2-line preview of the article..."
            rows={2}
          />

          <Textarea
            label="Full Article Body"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write the full publication content..."
            rows={8}
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
              Publish Post
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
