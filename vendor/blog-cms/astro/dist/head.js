import { descriptionFor } from "@blog-cms/contract";
import { absoluteUrl, applyTitleTemplate, modifiedDate, postPath } from "./urls.js";
export { absoluteUrl, postPath };
export function headModel(post, site) {
    const title = applyTitleTemplate(site.titleTemplate, post.data.seoTitle ?? post.data.title);
    const description = descriptionFor(post.data, post.body ?? "");
    const ownUrl = absoluteUrl(site.url, postPath(site.permalink, post.id, post.data.publishDate, site.timezone));
    const canonical = post.data.canonical ?? ownUrl;
    const imagePath = post.data.image ?? site.defaultImage;
    const image = absoluteUrl(site.url, imagePath);
    const imageAlt = post.data.image ? (post.data.imageAlt ?? "") : site.name;
    const tags = post.data.tags ?? [];
    const publishedTime = post.data.publishDate ?? "";
    const modifiedTime = modifiedDate(post.data);
    const jsonLd = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.data.title,
        description,
        datePublished: publishedTime,
        dateModified: modifiedTime,
        url: canonical,
        mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
        image,
        author: {
            "@type": "Person",
            name: site.authorName,
            url: site.authorUrl,
            sameAs: [...site.sameAs],
        },
        keywords: tags.join(", "),
    }).replaceAll("<", "\\u003c");
    return {
        title,
        description,
        canonical,
        noindex: post.data.noindex === true,
        image,
        imageAlt,
        publishedTime,
        modifiedTime,
        tags,
        siteName: site.name,
        jsonLd,
    };
}
