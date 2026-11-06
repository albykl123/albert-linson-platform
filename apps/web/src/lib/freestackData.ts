import freestackJson from "@/data/freestack_data.json";

export interface FreeStackService {
  name: string;
  url: string;
  category: string;
  description: string;
  sub_features: string[];
}

export interface FreeStackCatalog {
  total_categories: number;
  total_services: number;
  categories: string[];
  services: FreeStackService[];
  synced_at: string;
  source_repo: string;
  source_url: string;
  commit_sha: string;
}

export const freeStackData: FreeStackCatalog = freestackJson as FreeStackCatalog;

export function searchFreeStack(query: string, category?: string): FreeStackService[] {
  let list = freeStackData.services;

  if (category && category !== "All") {
    list = list.filter((s) => s.category.toLowerCase() === category.toLowerCase());
  }

  if (!query.trim()) {
    return list.slice(0, 50); // Return first 50 by default
  }

  const q = query.toLowerCase();
  return list
    .filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.sub_features.some((f) => f.toLowerCase().includes(q))
    )
    .slice(0, 100);
}
