"use client";

import { useState } from "react";
import { Send, Lock, Trash2, StickyNote } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import type { InternalNote } from "@/types/order";

interface InternalNotesCardProps {
  notes: InternalNote[];
  onAddNote: (note: InternalNote) => void;
  onDeleteNote: (id: string) => void;
}

const CURRENT_USER = "Admin";

export default function InternalNotesCard({
  notes,
  onAddNote,
  onDeleteNote,
}: InternalNotesCardProps) {
  const [text, setText]       = useState("");
  const [saving, setSaving]   = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  const handleAdd = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    onAddNote({
      id:        `note-${Date.now()}`,
      text:      trimmed,
      author:    CURRENT_USER,
      createdAt: new Date().toISOString(),
    });
    setText("");
    setSaving(false);
    toast("success", "Note added.");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAdd();
  };

  return (
    <Card>
      <CardHeader
        title="Internal Notes"
        description="Staff-only. Not visible to customers."
        action={
          <span className="flex items-center gap-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">
            <Lock size={10} /> Private
          </span>
        }
      />

      {/* Existing notes */}
      {notes.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-6 mb-4 rounded-xl bg-neutral-50 border border-dashed border-neutral-200">
          <StickyNote size={20} className="text-neutral-300" />
          <p className="text-xs text-neutral-400">No internal notes yet.</p>
        </div>
      ) : (
        <div className="space-y-2.5 mb-4">
          {notes.map((note) => (
            <div
              key={note.id}
              onMouseEnter={() => setHovered(note.id)}
              onMouseLeave={() => setHovered(null)}
              className="group relative p-3 rounded-xl bg-amber-50 border border-amber-100"
            >
              <p className="text-sm text-neutral-800 leading-relaxed pr-6">{note.text}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="size-5 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-[9px] font-bold text-brand-700">
                    {note.author.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <p className="text-[10px] text-neutral-500">
                  <span className="font-medium">{note.author}</span>
                  {" · "}
                  {new Date(note.createdAt).toLocaleString("en-US", {
                    month: "short",
                    day:   "numeric",
                    hour:  "2-digit",
                    minute:"2-digit",
                  })}
                </p>
              </div>
              <button
                onClick={() => {
                  onDeleteNote(note.id);
                  toast("success", "Note removed.");
                }}
                aria-label="Delete note"
                className={cn(
                  "absolute top-2.5 right-2.5 size-6 flex items-center justify-center rounded-lg transition-all",
                  "text-neutral-400 hover:text-red-600 hover:bg-red-50",
                  hovered === note.id ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                )}
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add note */}
      <div className="space-y-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a note… (⌘ Enter to save)"
          rows={3}
          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white focus:border-brand-500 transition-all"
        />
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-neutral-400">Only visible to staff</p>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Send size={12} />}
            loading={saving}
            disabled={!text.trim()}
            onClick={handleAdd}
          >
            Add Note
          </Button>
        </div>
      </div>
    </Card>
  );
}
