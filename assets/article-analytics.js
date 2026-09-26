(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {

  const article = document.querySelector("article.medical-article");
  if (!article || typeof window.gtag !== "function") return;

  const jsonLd = [...document.querySelectorAll('script[type="application/ld+json"]')]
    .map((node) => { try { return JSON.parse(node.textContent); } catch { return null; } })
    .find((data) => data?.["@type"] === "Article");
  const title = jsonLd?.headline || article.querySelector("h1")?.textContent?.trim() || document.title;
  const author = jsonLd?.author?.name || article.querySelector(".medical-article__author strong")?.textContent?.trim() || "";
  const slug = location.pathname.split("/").pop().replace(/\.html$/, "") || "home";
  const language = document.documentElement.lang || "fr";
  const category = article.querySelector(".article-tag")?.textContent?.split("·")[0]?.trim() || "";
  const metadata = { article_slug: slug, article_title: title, article_author: author, article_language: language };
  if (category) metadata.article_category = category;
  let sent = false;
  const sendRead = () => {
    if (sent) return;
    sent = true;
    window.gtag("event", "article_read", metadata);
  };

  window.setTimeout(sendRead, 30000);
  const onScroll = () => {
    const articleTop = article.getBoundingClientRect().top + window.scrollY;
    const progress = (window.scrollY + window.innerHeight - articleTop) / Math.max(article.offsetHeight, 1);
    if (progress >= 0.6) {
      sendRead();
      window.removeEventListener("scroll", onScroll);
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  article.querySelectorAll('.medical-article__author a[href*="linkedin.com"]').forEach((link) => {
    link.addEventListener("click", () => {
      window.gtag("event", "author_link_click", { author_name: author, platform: "linkedin", article_slug: slug, article_title: title });
    }, { passive: true });
  });
  });
}());
