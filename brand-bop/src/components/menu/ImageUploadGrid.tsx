"use client";

import { useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadGridProps {
  primary: string;
  gallery: string[];
  onPrimaryChange: (url: string) => void;
  onGalleryChange: (urls: string[]) => void;
  maxGallery?: number;
}

export default function ImageUploadGrid({
  primary,
  gallery,
  onPrimaryChange,
  onGalleryChange,
  maxGallery = 4,
}: ImageUploadGridProps) {
  const primaryRef  = useRef<HTMLInputElement>(null);
  const galleryRef  = useRef<HTMLInputElement>(null);

  const pickFile = (
    ref: React.RefObject<HTMLInputElement | null>,
    onFile: (url: string) => void,
  ) => {
    if (!ref.current) return;
    ref.current.value = "";
    ref.current.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) onFile(URL.createObjectURL(file));
    };
    ref.current.click();
  };

  const removeGallery = (idx: number) =>
    onGalleryChange(gallery.filter((_, i) => i !== idx));

  const addGallery = (url: string) => {
    if (gallery.length < maxGallery) onGalleryChange([...gallery, url]);
  };

  return (
    <div>
      <p className="form-label">Images</p>
      <div className="grid grid-cols-5 gap-3">
        {/* Primary — spans 2 cols/rows */}
        <UploadSlot
          url={primary}
          label="Primary"
          className="col-span-2 row-span-2 aspect-square"
          isPrimary
          onClick={() => pickFile(primaryRef, onPrimaryChange)}
          onRemove={() => onPrimaryChange("")}
        />

        {/* Gallery slots */}
        {Array.from({ length: maxGallery }).map((_, i) => {
          const url = gallery[i] ?? "";
          return (
            <UploadSlot
              key={i}
              url={url}
              label={`Photo ${i + 1}`}
              className="aspect-square"
              disabled={!url && gallery.length < i}
              onClick={() =>
                url
                  ? undefined
                  : pickFile(galleryRef, addGallery)
              }
              onRemove={() => removeGallery(i)}
            />
          );
        })}
      </div>

      <input ref={primaryRef} type="file" accept="image/*" className="sr-only" aria-hidden tabIndex={-1} />
      <input ref={galleryRef} type="file" accept="image/*" className="sr-only" aria-hidden tabIndex={-1} />

      <p className="mt-2 text-xs text-neutral-400">
        Primary image + up to {maxGallery} gallery photos. Recommended: 800×600px, JPG/PNG/WebP.
      </p>
    </div>
  );
}

function UploadSlot({
  url,
  label,
  className,
  isPrimary = false,
  disabled = false,
  onClick,
  onRemove,
}: {
  url: string;
  label: string;
  className?: string;
  isPrimary?: boolean;
  disabled?: boolean;
  onClick: () => void;
  onRemove: () => void;
}) {
  return (
    <div className={cn("relative rounded-xl overflow-hidden", className)}>
      {url ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={label}
            className="w-full h-full object-cover"
          />
          {isPrimary && (
            <span className="absolute bottom-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/50 text-white">
              Primary
            </span>
          )}
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${label}`}
            className="absolute top-1.5 right-1.5 size-6 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-red-500 transition-colors"
          >
            <X size={11} />
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          aria-label={`Upload ${label}`}
          className={cn(
            "w-full h-full flex flex-col items-center justify-center gap-1",
            "border-2 border-dashed rounded-xl transition-colors",
            disabled
              ? "border-neutral-100 bg-neutral-50 cursor-not-allowed"
              : "border-neutral-200 bg-neutral-50 hover:border-brand-300 hover:bg-brand-50 cursor-pointer",
          )}
        >
          {isPrimary ? (
            <>
              <Upload size={20} className="text-neutral-400" />
              <span className="text-[10px] text-neutral-400 font-medium">Primary</span>
            </>
          ) : (
            <ImageIcon size={14} className={disabled ? "text-neutral-200" : "text-neutral-300"} />
          )}
        </button>
      )}
    </div>
  );
}
