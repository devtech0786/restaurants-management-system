export interface BrandConfig {
  id: string;
  name: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  address: string;
  description: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  updatedAt: string;
}

export type BrandConfigDraft = Omit<BrandConfig, "id" | "updatedAt">;
