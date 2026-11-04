export function getPublishedPosts(posts) {
    return posts
        .filter((post) => post.data.status === "published")
        .sort((a, b) => (b.data.publishDate ?? "").localeCompare(a.data.publishDate ?? ""));
}
