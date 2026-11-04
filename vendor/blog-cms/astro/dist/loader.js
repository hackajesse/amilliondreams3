import { readdir, readFile } from "node:fs/promises";
import { relative, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { FRONTMATTER_FIELDS, parsePost } from "@blog-cms/contract";
export function htmlPostsLoader(options) {
    return {
        name: "html-posts",
        load: async ({ store, parseData, generateDigest, config }) => {
            const directory = resolveBase(options.base, config.root);
            const directoryPath = fileURLToPath(directory);
            let names;
            try {
                names = await readdir(directoryPath);
            }
            catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                throw new Error(`Could not read posts from ${directoryPath}: ${message}`, { cause: error });
            }
            const seen = new Set();
            for (const name of names) {
                if (!name.endsWith(".html"))
                    continue;
                const id = name.slice(0, -".html".length);
                const text = await readFile(new URL(name, directory), "utf8");
                let parsed;
                try {
                    parsed = parsePost(text);
                }
                catch (error) {
                    const message = error instanceof Error ? error.message : String(error);
                    throw new Error(`Could not parse ${name}: ${message}`, { cause: error });
                }
                const filePath = relative(fileURLToPath(config.root), fileURLToPath(new URL(name, directory)))
                    .split(sep)
                    .join("/");
                const data = await parseData({ id, data: frontmatterData(parsed.frontmatter), filePath });
                store.set({
                    id,
                    data,
                    body: parsed.body,
                    filePath,
                    digest: generateDigest(text),
                    rendered: { html: parsed.body },
                });
                seen.add(id);
            }
            for (const id of store.keys()) {
                if (!seen.has(id))
                    store.delete(id);
            }
        },
    };
}
function frontmatterData(frontmatter) {
    const data = {};
    for (const field of FRONTMATTER_FIELDS) {
        const value = frontmatter[field];
        if (value !== undefined)
            data[field] = value;
    }
    return data;
}
function resolveBase(base, root) {
    const rootHref = root.href.endsWith("/") ? root.href : `${root.href}/`;
    const url = base instanceof URL
        ? new URL(base.href)
        : base.startsWith("file:")
            ? new URL(base)
            : base.startsWith("/")
                ? pathToFileURL(base)
                : new URL(base, rootHref);
    if (!url.pathname.endsWith("/"))
        url.pathname += "/";
    return url;
}
