const NOTION_CDN_PATTERNS = [
  "prod-files-secure.s3",
  "amazonaws.com/notion",
  "notion.so/image/",
  "notion-images",
];

/**
 * Extracts all images with their URLs and alt text from an HTML string.
 */
export function extractImages(html: string): { url: string; alt: string }[] {
  const results: { url: string; alt: string }[] = [];
  const regex = /<img[^>]+src=["']([^"']+)["'][^>]*(?:alt=["']([^"']*)["'])?[^>]*>/gi;
  const matches = html.matchAll(regex);

  for (const match of matches) {
    results.push({
      url: match[1],
      alt: match[2] || "",
    });
  }

  return results;
}

/**
 * Checks if a URL is from Notion's image CDN.
 */
export function isNotionImage(url: string): boolean {
  return NOTION_CDN_PATTERNS.some((pattern) =>
    url.toLowerCase().includes(pattern)
  );
}

/**
 * Downloads an image from a URL and converts it to a base64 data URI.
 * Only works client-side (uses fetch + canvas/FileReader).
 */
export async function imageUrlToBase64(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Replaces all image URLs in HTML with base64 data URIs.
 */
export async function replaceImagesWithBase64(html: string): Promise<string> {
  const images = extractImages(html);
  const replacements: Map<string, string> = new Map();

  const base64Results = await Promise.allSettled(
    images.map(async (img) => {
      const dataUri = await imageUrlToBase64(img.url);
      return { url: img.url, dataUri };
    })
  );

  for (const result of base64Results) {
    if (result.status === "fulfilled") {
      replacements.set(result.value.url, result.value.dataUri);
    }
  }

  let result = html;
  for (const [url, dataUri] of replacements) {
    result = result.replace(new RegExp(escapeRegex(url), "g"), dataUri);
  }

  return result;
}

/**
 * Generates a suggested local file path for a Notion image.
 * Example: /images/posts/my-post/image-01.png
 */
export function imageUrlToLocalPath(
  url: string,
  slug: string,
  index: number
): string {
  const ext = getExtensionFromUrl(url) || "png";
  const paddedIndex = String(index + 1).padStart(2, "0");
  return `/images/posts/${slug}/image-${paddedIndex}.${ext}`;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getExtensionFromUrl(url: string): string | null {
  try {
    const pathname = new URL(url).pathname;
    const match = pathname.match(/\.([a-z]+)(?:\?|$)/i);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}
