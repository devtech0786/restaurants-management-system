"use client";

import { useState, useCallback } from "react";
import { Upload, Instagram, Facebook, Twitter, Globe, Phone, Mail, MapPin } from "lucide-react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import ColorPicker from "@/components/ui/ColorPicker";
import { Card, CardHeader, Divider } from "@/components/ui/Card";
import { toast } from "@/components/ui/Toast";
import type { BrandConfig } from "@/types/brand";

interface BrandConfigFormProps {
  initialData: BrandConfig;
}

type Errors = Partial<Record<keyof BrandConfig | string, string>>;

function validate(data: BrandConfig): Errors {
  const errors: Errors = {};
  if (!data.name.trim())           errors.name         = "Brand name is required.";
  if (!data.contactEmail.trim())   errors.contactEmail = "Contact email is required.";
  if (data.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail))
                                   errors.contactEmail = "Enter a valid email address.";
  if (data.website && !/^https?:\/\//.test(data.website))
                                   errors.website      = "Website must start with http:// or https://";
  return errors;
}

export default function BrandConfigForm({ initialData }: BrandConfigFormProps) {
  const [form, setForm]       = useState<BrandConfig>(initialData);
  const [errors, setErrors]   = useState<Errors>({});
  const [saving, setSaving]   = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const update = useCallback(
    <K extends keyof BrandConfig>(key: K, value: BrandConfig[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setIsDirty(true);
      if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    },
    [errors],
  );

  const updateSocial = useCallback(
    (key: keyof BrandConfig["socialLinks"], value: string) => {
      setForm((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [key]: value },
      }));
      setIsDirty(true);
    },
    [],
  );

  const handleSave = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast("error", "Please fix the highlighted errors before saving.");
      return;
    }

    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      setIsDirty(false);
      toast("success", "Brand configuration saved successfully.");
    } catch {
      toast("error", "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setForm(initialData);
    setErrors({});
    setIsDirty(false);
    toast("warning", "Changes discarded.");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Identity */}
      <Card>
        <CardHeader
          title="Brand Identity"
          description="Core details that define your brand's public-facing presence."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Brand Name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            error={errors.name}
            placeholder="e.g. Flavour House"
            required
          />
          <Input
            label="Tagline"
            value={form.tagline}
            onChange={(e) => update("tagline", e.target.value)}
            placeholder="e.g. Taste the Difference"
          />
          <div className="md:col-span-2">
            <Textarea
              label="Description"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="A short description of your restaurant brand…"
              rows={3}
              helperText="Shown on your public brand page and SEO meta tags."
            />
          </div>
        </div>
      </Card>

      {/* Logo & Favicon */}
      <Card>
        <CardHeader
          title="Logo & Favicon"
          description="Visual assets that represent your brand across the platform."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <LogoUploadZone
            label="Brand Logo"
            hint="SVG, PNG, or JPG — recommended 400×200px"
            value={form.logoUrl}
            onUpload={(url) => update("logoUrl", url)}
          />
          <LogoUploadZone
            label="Favicon"
            hint="PNG or ICO — recommended 64×64px"
            value={form.faviconUrl}
            onUpload={(url) => update("faviconUrl", url)}
            square
          />
        </div>
      </Card>

      {/* Colors */}
      <Card>
        <CardHeader
          title="Color Theme"
          description="Define your brand's color palette used across the platform."
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <ColorPicker
            label="Primary Color"
            value={form.primaryColor}
            onChange={(v) => update("primaryColor", v)}
            helperText="Main brand color for buttons and highlights."
          />
          <ColorPicker
            label="Secondary Color"
            value={form.secondaryColor}
            onChange={(v) => update("secondaryColor", v)}
            helperText="Used for backgrounds and secondary elements."
          />
          <ColorPicker
            label="Accent Color"
            value={form.accentColor}
            onChange={(v) => update("accentColor", v)}
            helperText="Used for badges, tags, and call-to-action highlights."
          />
        </div>

        <div className="mt-5 p-4 rounded-xl border border-neutral-100 bg-neutral-50">
          <p className="text-xs font-medium text-neutral-600 mb-3">Live Preview</p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              className="h-9 px-4 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: form.primaryColor }}
            >
              Primary Button
            </button>
            <button
              className="h-9 px-4 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: form.secondaryColor }}
            >
              Secondary Button
            </button>
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: form.accentColor }}
            >
              Accent Badge
            </span>
            <div
              className="h-6 w-6 rounded-md"
              style={{ backgroundColor: form.primaryColor }}
              title="Primary swatch"
            />
            <div
              className="h-6 w-6 rounded-md"
              style={{ backgroundColor: form.secondaryColor }}
              title="Secondary swatch"
            />
            <div
              className="h-6 w-6 rounded-md"
              style={{ backgroundColor: form.accentColor }}
              title="Accent swatch"
            />
          </div>
        </div>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader
          title="Contact Information"
          description="How customers and partners can reach your headquarters."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Contact Email"
            type="email"
            value={form.contactEmail}
            onChange={(e) => update("contactEmail", e.target.value)}
            error={errors.contactEmail}
            leftAddon={<Mail size={14} />}
            placeholder="hello@yourbrand.com"
            required
          />
          <Input
            label="Phone Number"
            type="tel"
            value={form.contactPhone}
            onChange={(e) => update("contactPhone", e.target.value)}
            leftAddon={<Phone size={14} />}
            placeholder="+1 (555) 000-0000"
          />
          <Input
            label="Website"
            type="url"
            value={form.website}
            onChange={(e) => update("website", e.target.value)}
            error={errors.website}
            leftAddon={<Globe size={14} />}
            placeholder="https://yourbrand.com"
          />
          <Input
            label="HQ Address"
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            leftAddon={<MapPin size={14} />}
            placeholder="123 Main St, City, Country"
          />
        </div>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader
          title="Social Media"
          description="Link your brand's official social media profiles."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Input
            label="Instagram"
            value={form.socialLinks.instagram ?? ""}
            onChange={(e) => updateSocial("instagram", e.target.value)}
            leftAddon={<Instagram size={14} />}
            placeholder="https://instagram.com/…"
          />
          <Input
            label="Facebook"
            value={form.socialLinks.facebook ?? ""}
            onChange={(e) => updateSocial("facebook", e.target.value)}
            leftAddon={<Facebook size={14} />}
            placeholder="https://facebook.com/…"
          />
          <Input
            label="Twitter / X"
            value={form.socialLinks.twitter ?? ""}
            onChange={(e) => updateSocial("twitter", e.target.value)}
            leftAddon={<Twitter size={14} />}
            placeholder="https://twitter.com/…"
          />
        </div>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-neutral-400">
          Last updated:{" "}
          {new Date(form.updatedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <div className="flex items-center gap-3">
          {isDirty && (
            <Button variant="ghost" size="md" onClick={handleDiscard} disabled={saving}>
              Discard Changes
            </Button>
          )}
          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            loading={saving}
            disabled={!isDirty}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

function LogoUploadZone({
  label,
  hint,
  value,
  onUpload,
  square = false,
}: {
  label: string;
  hint: string;
  value: string;
  onUpload: (url: string) => void;
  square?: boolean;
}) {
  return (
    <div>
      <p className="form-label">{label}</p>
      <label
        className={`flex flex-col items-center justify-center border-2 border-dashed border-neutral-200 rounded-xl bg-neutral-50 hover:bg-neutral-100 hover:border-brand-300 transition-colors cursor-pointer ${square ? "aspect-square max-w-[140px]" : "h-32 w-full"}`}
        tabIndex={0}
        role="button"
        aria-label={`Upload ${label}`}
        onKeyDown={(e) => e.key === "Enter" && (e.currentTarget.querySelector("input") as HTMLInputElement)?.click()}
      >
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const url = URL.createObjectURL(file);
              onUpload(url);
            }
          }}
        />
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt={label}
            className="max-h-full max-w-full object-contain p-2 rounded-lg"
          />
        ) : (
          <>
            <Upload size={20} className="text-neutral-400 mb-2" />
            <span className="text-xs text-neutral-500 font-medium">Click to upload</span>
            <span className="text-[10px] text-neutral-400 mt-0.5 text-center px-2">{hint}</span>
          </>
        )}
      </label>
    </div>
  );
}
