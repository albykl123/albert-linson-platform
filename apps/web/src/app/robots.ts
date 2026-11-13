import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/about", "/experience", "/education", "/projects", "/leadership"],
      disallow: ["/resume", "/skills", "/matcher", "/admin", "/studio", "/api/"],
    },
    sitemap: "https://albert-linson-platform.albertkalampadan.workers.dev/sitemap.xml",
  };
}
