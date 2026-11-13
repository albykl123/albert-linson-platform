import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://albert-linson-platform.albertkalampadan.workers.dev";
  const now = new Date();

  const publicRoutes = [
    "",
    "/about",
    "/experience",
    "/education",
    "/projects",
    "/leadership",
  ];

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
