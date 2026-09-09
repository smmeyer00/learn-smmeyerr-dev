import type { MetadataRoute } from "next";
import { courses } from "@/content";

const BASE = "https://learn.smmeyer.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: new Date() },
    { url: `${BASE}/drills`, lastModified: new Date() },
    { url: `${BASE}/mock`, lastModified: new Date() },
    { url: `${BASE}/field-manual`, lastModified: new Date() },
    { url: `${BASE}/glossary`, lastModified: new Date() },
  ];

  for (const course of courses) {
    entries.push({ url: `${BASE}/${course.slug}`, lastModified: new Date() });
    for (const chapter of course.chapters) {
      entries.push({
        url: `${BASE}/${course.slug}/${chapter.slug}`,
        lastModified: new Date(),
      });
    }
  }

  return entries;
}
