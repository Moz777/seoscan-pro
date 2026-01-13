/**
 * HTML Analyzer Service
 * Fetches and parses HTML to extract SEO-relevant data
 */

import * as cheerio from "cheerio";

// Types for analysis results
export interface MetaTagsAnalysis {
  title: string | null;
  titleLength: number;
  description: string | null;
  descriptionLength: number;
  robots: string | null;
  canonical: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  twitterCard: string | null;
  viewport: string | null;
  charset: string | null;
  language: string | null;
  issues: MetaIssue[];
}

export interface MetaIssue {
  type: "missing" | "too_short" | "too_long" | "duplicate" | "invalid";
  field: string;
  message: string;
  severity: "critical" | "warning" | "info";
}

export interface HeadingAnalysis {
  h1: string[];
  h2: string[];
  h3: string[];
  h4: string[];
  h5: string[];
  h6: string[];
  structure: HeadingNode[];
  issues: HeadingIssue[];
}

export interface HeadingNode {
  level: number;
  text: string;
  order: number;
}

export interface HeadingIssue {
  type: "missing_h1" | "multiple_h1" | "skipped_level" | "empty_heading" | "too_long";
  message: string;
  severity: "critical" | "warning" | "info";
}

export interface ImageAnalysis {
  total: number;
  withAlt: number;
  withoutAlt: number;
  emptyAlt: number;
  decorativeAlt: number;
  images: ImageInfo[];
  issues: ImageIssue[];
}

export interface ImageInfo {
  src: string;
  alt: string | null;
  width: string | null;
  height: string | null;
  loading: string | null;
  hasAlt: boolean;
  isDecorative: boolean;
}

export interface ImageIssue {
  type: "missing_alt" | "empty_alt" | "missing_dimensions" | "no_lazy_loading";
  src: string;
  message: string;
  severity: "critical" | "warning" | "info";
}

export interface LinkAnalysis {
  internal: LinkInfo[];
  external: LinkInfo[];
  internalCount: number;
  externalCount: number;
  brokenPatterns: LinkInfo[];
  nofollow: LinkInfo[];
  issues: LinkIssue[];
}

export interface LinkInfo {
  href: string;
  text: string;
  isNofollow: boolean;
  isNewTab: boolean;
  isInternal: boolean;
}

export interface LinkIssue {
  type: "empty_link" | "generic_anchor" | "too_many_links" | "nofollow_internal";
  href: string;
  message: string;
  severity: "critical" | "warning" | "info";
}

export interface SchemaAnalysis {
  hasSchema: boolean;
  schemas: SchemaInfo[];
  jsonLdCount: number;
  microdataCount: number;
  issues: SchemaIssue[];
}

export interface SchemaInfo {
  type: string;
  format: "json-ld" | "microdata" | "rdfa";
  raw?: string;
}

export interface SchemaIssue {
  type: "missing_schema" | "invalid_json" | "missing_required";
  message: string;
  severity: "critical" | "warning" | "info";
}

export interface HTMLAnalysisResult {
  url: string;
  fetchedAt: Date;
  statusCode: number;
  contentType: string | null;
  contentLength: number;
  loadTime: number;
  metaTags: MetaTagsAnalysis;
  headings: HeadingAnalysis;
  images: ImageAnalysis;
  links: LinkAnalysis;
  schema: SchemaAnalysis;
  wordCount: number;
  textToHtmlRatio: number;
}

/**
 * Fetch and analyze HTML from a URL
 */
export async function analyzeHTML(url: string): Promise<HTMLAnalysisResult> {
  const startTime = Date.now();

  // Fetch the HTML
  const response = await fetch(url, {
    headers: {
      "User-Agent": "SEOScan-Pro/1.0 (SEO Analysis Bot)",
      Accept: "text/html,application/xhtml+xml",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const loadTime = Date.now() - startTime;

  // Parse with cheerio
  const $ = cheerio.load(html);

  // Get base URL for resolving relative links
  const baseUrl = new URL(url);

  // Run all analyses
  const metaTags = analyzeMetaTags($);
  const headings = analyzeHeadings($);
  const images = analyzeImages($, baseUrl);
  const links = analyzeLinks($, baseUrl);
  const schema = analyzeSchema($);

  // Calculate text metrics
  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const wordCount = bodyText.split(/\s+/).filter((w) => w.length > 0).length;
  const textToHtmlRatio = Math.round((bodyText.length / html.length) * 100);

  return {
    url,
    fetchedAt: new Date(),
    statusCode: response.status,
    contentType: response.headers.get("content-type"),
    contentLength: html.length,
    loadTime,
    metaTags,
    headings,
    images,
    links,
    schema,
    wordCount,
    textToHtmlRatio,
  };
}

/**
 * Analyze meta tags
 */
function analyzeMetaTags($: cheerio.CheerioAPI): MetaTagsAnalysis {
  const issues: MetaIssue[] = [];

  // Title
  const title = $("title").first().text().trim() || null;
  const titleLength = title?.length || 0;

  if (!title) {
    issues.push({
      type: "missing",
      field: "title",
      message: "Page is missing a title tag",
      severity: "critical",
    });
  } else if (titleLength < 30) {
    issues.push({
      type: "too_short",
      field: "title",
      message: `Title is too short (${titleLength} chars). Recommended: 30-60 characters`,
      severity: "warning",
    });
  } else if (titleLength > 60) {
    issues.push({
      type: "too_long",
      field: "title",
      message: `Title is too long (${titleLength} chars). May be truncated in search results`,
      severity: "warning",
    });
  }

  // Meta description
  const description =
    $('meta[name="description"]').attr("content")?.trim() || null;
  const descriptionLength = description?.length || 0;

  if (!description) {
    issues.push({
      type: "missing",
      field: "description",
      message: "Page is missing a meta description",
      severity: "critical",
    });
  } else if (descriptionLength < 70) {
    issues.push({
      type: "too_short",
      field: "description",
      message: `Meta description is too short (${descriptionLength} chars). Recommended: 70-160 characters`,
      severity: "warning",
    });
  } else if (descriptionLength > 160) {
    issues.push({
      type: "too_long",
      field: "description",
      message: `Meta description is too long (${descriptionLength} chars). May be truncated in search results`,
      severity: "warning",
    });
  }

  // Robots
  const robots = $('meta[name="robots"]').attr("content")?.trim() || null;

  // Canonical
  const canonical = $('link[rel="canonical"]').attr("href")?.trim() || null;
  if (!canonical) {
    issues.push({
      type: "missing",
      field: "canonical",
      message: "Page is missing a canonical URL",
      severity: "warning",
    });
  }

  // Open Graph
  const ogTitle = $('meta[property="og:title"]').attr("content")?.trim() || null;
  const ogDescription = $('meta[property="og:description"]').attr("content")?.trim() || null;
  const ogImage = $('meta[property="og:image"]').attr("content")?.trim() || null;

  if (!ogTitle || !ogDescription || !ogImage) {
    issues.push({
      type: "missing",
      field: "open_graph",
      message: "Missing Open Graph tags (og:title, og:description, or og:image)",
      severity: "info",
    });
  }

  // Twitter Card
  const twitterCard = $('meta[name="twitter:card"]').attr("content")?.trim() || null;

  // Viewport
  const viewport = $('meta[name="viewport"]').attr("content")?.trim() || null;
  if (!viewport) {
    issues.push({
      type: "missing",
      field: "viewport",
      message: "Page is missing viewport meta tag (important for mobile)",
      severity: "critical",
    });
  }

  // Charset
  const charset =
    $('meta[charset]').attr("charset")?.trim() ||
    $('meta[http-equiv="Content-Type"]').attr("content")?.match(/charset=([^;]+)/)?.[1] ||
    null;

  // Language
  const language = $("html").attr("lang")?.trim() || null;
  if (!language) {
    issues.push({
      type: "missing",
      field: "language",
      message: "HTML element is missing lang attribute",
      severity: "warning",
    });
  }

  return {
    title,
    titleLength,
    description,
    descriptionLength,
    robots,
    canonical,
    ogTitle,
    ogDescription,
    ogImage,
    twitterCard,
    viewport,
    charset,
    language,
    issues,
  };
}

/**
 * Analyze heading structure
 */
function analyzeHeadings($: cheerio.CheerioAPI): HeadingAnalysis {
  const issues: HeadingIssue[] = [];
  const structure: HeadingNode[] = [];

  const h1: string[] = [];
  const h2: string[] = [];
  const h3: string[] = [];
  const h4: string[] = [];
  const h5: string[] = [];
  const h6: string[] = [];

  let order = 0;
  let lastLevel = 0;

  $("h1, h2, h3, h4, h5, h6").each((_, el) => {
    const tagName = $(el).prop("tagName")?.toLowerCase() || "";
    const level = parseInt(tagName.replace("h", ""), 10);
    const text = $(el).text().replace(/\s+/g, " ").trim();

    order++;
    structure.push({ level, text, order });

    // Check for empty headings
    if (!text) {
      issues.push({
        type: "empty_heading",
        message: `Empty ${tagName.toUpperCase()} heading found`,
        severity: "warning",
      });
    }

    // Check for skipped levels
    if (lastLevel > 0 && level > lastLevel + 1) {
      issues.push({
        type: "skipped_level",
        message: `Heading level skipped from H${lastLevel} to H${level}`,
        severity: "warning",
      });
    }

    // Check for too long headings
    if (text.length > 70) {
      issues.push({
        type: "too_long",
        message: `${tagName.toUpperCase()} heading is too long (${text.length} chars)`,
        severity: "info",
      });
    }

    lastLevel = level;

    // Categorize headings
    switch (level) {
      case 1: h1.push(text); break;
      case 2: h2.push(text); break;
      case 3: h3.push(text); break;
      case 4: h4.push(text); break;
      case 5: h5.push(text); break;
      case 6: h6.push(text); break;
    }
  });

  // Check for H1 issues
  if (h1.length === 0) {
    issues.push({
      type: "missing_h1",
      message: "Page is missing an H1 heading",
      severity: "critical",
    });
  } else if (h1.length > 1) {
    issues.push({
      type: "multiple_h1",
      message: `Page has ${h1.length} H1 headings. Recommended: only one H1 per page`,
      severity: "warning",
    });
  }

  return {
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    structure,
    issues,
  };
}

/**
 * Analyze images
 */
function analyzeImages($: cheerio.CheerioAPI, baseUrl: URL): ImageAnalysis {
  const issues: ImageIssue[] = [];
  const images: ImageInfo[] = [];

  $("img").each((_, el) => {
    const $img = $(el);
    const src = $img.attr("src") || "";
    const alt = $img.attr("alt");
    const width = $img.attr("width") || null;
    const height = $img.attr("height") || null;
    const loading = $img.attr("loading") || null;

    const hasAlt = alt !== undefined;
    const isDecorative = alt === "";

    // Resolve relative URLs
    let resolvedSrc = src;
    try {
      resolvedSrc = new URL(src, baseUrl).href;
    } catch {
      // Keep original if URL parsing fails
    }

    images.push({
      src: resolvedSrc,
      alt: alt ?? null,
      width,
      height,
      loading,
      hasAlt,
      isDecorative,
    });

    // Check for missing alt
    if (!hasAlt) {
      issues.push({
        type: "missing_alt",
        src: resolvedSrc,
        message: "Image is missing alt attribute",
        severity: "critical",
      });
    }

    // Check for missing dimensions (causes layout shift)
    if (!width || !height) {
      issues.push({
        type: "missing_dimensions",
        src: resolvedSrc,
        message: "Image is missing width/height attributes (may cause layout shift)",
        severity: "warning",
      });
    }
  });

  return {
    total: images.length,
    withAlt: images.filter((i) => i.hasAlt && !i.isDecorative).length,
    withoutAlt: images.filter((i) => !i.hasAlt).length,
    emptyAlt: images.filter((i) => i.isDecorative).length,
    decorativeAlt: images.filter((i) => i.isDecorative).length,
    images,
    issues,
  };
}

/**
 * Analyze links
 */
function analyzeLinks($: cheerio.CheerioAPI, baseUrl: URL): LinkAnalysis {
  const issues: LinkIssue[] = [];
  const internal: LinkInfo[] = [];
  const external: LinkInfo[] = [];
  const nofollow: LinkInfo[] = [];
  const brokenPatterns: LinkInfo[] = [];

  const genericAnchors = ["click here", "read more", "learn more", "here", "link", "more"];

  $("a[href]").each((_, el) => {
    const $link = $(el);
    const href = $link.attr("href") || "";
    const text = $link.text().replace(/\s+/g, " ").trim();
    const rel = $link.attr("rel") || "";
    const target = $link.attr("target") || "";

    // Skip anchor links and javascript
    if (href.startsWith("#") || href.startsWith("javascript:") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      return;
    }

    const isNofollow = rel.includes("nofollow");
    const isNewTab = target === "_blank";

    // Determine if internal or external
    let isInternal = false;
    let resolvedHref = href;

    try {
      const linkUrl = new URL(href, baseUrl);
      resolvedHref = linkUrl.href;
      isInternal = linkUrl.hostname === baseUrl.hostname;
    } catch {
      // Relative URLs are internal
      isInternal = true;
    }

    const linkInfo: LinkInfo = {
      href: resolvedHref,
      text,
      isNofollow,
      isNewTab,
      isInternal,
    };

    if (isInternal) {
      internal.push(linkInfo);
      if (isNofollow) {
        nofollow.push(linkInfo);
        issues.push({
          type: "nofollow_internal",
          href: resolvedHref,
          message: "Internal link has nofollow attribute",
          severity: "warning",
        });
      }
    } else {
      external.push(linkInfo);
    }

    // Check for empty link text
    if (!text && !$link.find("img").length) {
      issues.push({
        type: "empty_link",
        href: resolvedHref,
        message: "Link has no text or image content",
        severity: "warning",
      });
    }

    // Check for generic anchor text
    if (genericAnchors.includes(text.toLowerCase())) {
      issues.push({
        type: "generic_anchor",
        href: resolvedHref,
        message: `Generic anchor text "${text}" is not descriptive`,
        severity: "info",
      });
    }
  });

  // Check for too many links
  const totalLinks = internal.length + external.length;
  if (totalLinks > 100) {
    issues.push({
      type: "too_many_links",
      href: "",
      message: `Page has ${totalLinks} links. Consider reducing for better crawl efficiency`,
      severity: "info",
    });
  }

  return {
    internal,
    external,
    internalCount: internal.length,
    externalCount: external.length,
    brokenPatterns,
    nofollow,
    issues,
  };
}

/**
 * Analyze schema/structured data
 */
function analyzeSchema($: cheerio.CheerioAPI): SchemaAnalysis {
  const issues: SchemaIssue[] = [];
  const schemas: SchemaInfo[] = [];

  // Find JSON-LD schemas
  $('script[type="application/ld+json"]').each((_, el) => {
    const content = $(el).html();
    if (content) {
      try {
        const parsed = JSON.parse(content);
        const types = extractSchemaTypes(parsed);
        types.forEach((type) => {
          schemas.push({
            type,
            format: "json-ld",
            raw: content.substring(0, 500),
          });
        });
      } catch {
        issues.push({
          type: "invalid_json",
          message: "Invalid JSON-LD structured data found",
          severity: "critical",
        });
      }
    }
  });

  // Find microdata
  $("[itemtype]").each((_, el) => {
    const itemtype = $(el).attr("itemtype") || "";
    const type = itemtype.split("/").pop() || itemtype;
    schemas.push({
      type,
      format: "microdata",
    });
  });

  const hasSchema = schemas.length > 0;
  if (!hasSchema) {
    issues.push({
      type: "missing_schema",
      message: "No structured data (Schema.org) found on the page",
      severity: "warning",
    });
  }

  return {
    hasSchema,
    schemas,
    jsonLdCount: schemas.filter((s) => s.format === "json-ld").length,
    microdataCount: schemas.filter((s) => s.format === "microdata").length,
    issues,
  };
}

/**
 * Extract schema types from JSON-LD object
 */
function extractSchemaTypes(obj: any): string[] {
  const types: string[] = [];

  if (Array.isArray(obj)) {
    obj.forEach((item) => {
      types.push(...extractSchemaTypes(item));
    });
  } else if (obj && typeof obj === "object") {
    if (obj["@type"]) {
      if (Array.isArray(obj["@type"])) {
        types.push(...obj["@type"]);
      } else {
        types.push(obj["@type"]);
      }
    }
    // Check @graph
    if (obj["@graph"]) {
      types.push(...extractSchemaTypes(obj["@graph"]));
    }
  }

  return types;
}
