const cache = new Map<string, string>();

interface SteamSearchItem {
  id: number;
  name: string;
  tiny_image?: string;
}

interface SteamSearchResponse {
  total: number;
  items?: SteamSearchItem[];
}


async function fetchWikipediaCover(title: string): Promise<string | null> {
  try {
    const searchQueries = [`${title} video game`, title];

    let candidate: string | null = null;

    for (const query of searchQueries) {
      const res = await fetch(
        `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(
          query
        )}&limit=5&namespace=0&format=json&origin=*`
      );
      if (!res.ok) continue;

      const [, titles]: [string, string[]] = await res.json();
      if (!titles || titles.length === 0) continue;

      candidate =
        titles.find((t) => /video game/i.test(t)) ||
        titles.find((t) => t.toLowerCase() === title.toLowerCase()) ||
        titles[0];

      if (candidate) break;
    }

    if (!candidate) return null;

    const cleanCandidate = candidate.replace(/\s+/g, '_');
    const summaryRes = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanCandidate)}`
    );

    if (!summaryRes.ok) return null;

    const summaryData = await summaryRes.json();
    if (summaryData.thumbnail?.source) {
      return summaryData.thumbnail.source as string;
    }

    return null;
  } catch {
    return null;
  }
}

async function fetchSteamCover(title: string): Promise<string | null> {
  try {
    const res = await fetch(
      `/api-steam/api/storesearch/?term=${encodeURIComponent(title)}&l=english&cc=US`
    );
    if (!res.ok) return null;

    const data: SteamSearchResponse = await res.json();
    if (!data.items || data.items.length === 0) return null;

    const normalizedInput = title.toLowerCase().replace(/[^a-z0-9]/g, '');
    const matched =
      data.items.find((item) => {
        const normName = item.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        return normName === normalizedInput || normName.includes(normalizedInput);
      }) || data.items[0];

    if (!matched?.id) return null;

    const coverUrl = `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${matched.id}/library_600x900.jpg`;

    const imgCheck = await new Promise<boolean>((resolve) => {
      const img = new Image();
      img.referrerPolicy = 'no-referrer';
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = coverUrl;
    });

    if (imgCheck) return coverUrl;

    return `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${matched.id}/header.jpg`;
  } catch {
    return null;
  }
}


export async function searchGameCover(title: string): Promise<string | null> {
  const trimmed = title.trim();
  if (!trimmed || trimmed.length < 2) return null;

  const cacheKey = `game_cover_${trimmed.toLowerCase()}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey) || null;
  }

  const stored = sessionStorage.getItem(cacheKey);
  if (stored) {
    cache.set(cacheKey, stored);
    return stored;
  }


  let cover = await fetchWikipediaCover(trimmed);

  if (!cover) {
    cover = await fetchSteamCover(trimmed);
  }

  if (cover) {
    cache.set(cacheKey, cover);
    try {
      sessionStorage.setItem(cacheKey, cover);
    } catch {
    }
  }

  return cover;
}
