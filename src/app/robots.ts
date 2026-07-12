import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

/**
 * Required by `output: "export"`. Without it the build fails outright rather than shipping
 * a site with no robots.txt — the correct trade, but it must be declared, not assumed.
 */
export const dynamic = "force-static";

/**
 * robots.txt
 *
 * The AI crawlers are listed EXPLICITLY and allowed.
 *
 * This is the part most sites get wrong without realising it. Many "SEO-hardened"
 * boilerplates copy a robots.txt that blocks GPTBot, ClaudeBot and friends by default —
 * and the site then quietly disappears from ChatGPT, Claude and Perplexity answers while
 * still ranking fine on Google. For a gifting brand, being the shop an assistant names
 * when someone asks "where can I order Eid gift boxes" is worth as much as a blue link.
 *
 * Google-Extended is separate from Googlebot: it governs whether the content may be used
 * in AI Overviews and Gemini grounding. Blocking it does NOT affect classic search rank,
 * and allowing it is what puts you in the AI answer box.
 *
 * If you ever want OUT of AI training, this is the file to change — one place, and it is
 * a business decision, not a technical one.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },

      // Search + AI answer engines.
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" }, // AI Overviews / Gemini grounding
      { userAgent: "Bingbot", allow: "/" },
      { userAgent: "GPTBot", allow: "/" }, // OpenAI crawler
      { userAgent: "OAI-SearchBot", allow: "/" }, // ChatGPT Search
      { userAgent: "ChatGPT-User", allow: "/" }, // ChatGPT live browsing
      { userAgent: "ClaudeBot", allow: "/" }, // Anthropic crawler
      { userAgent: "Claude-User", allow: "/" }, // Claude live browsing
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Applebot", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" }, // Apple Intelligence
      { userAgent: "meta-externalagent", allow: "/" },
      { userAgent: "Amazonbot", allow: "/" },
      { userAgent: "DuckAssistBot", allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
