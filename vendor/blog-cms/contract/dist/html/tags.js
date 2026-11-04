export const VOID_ELEMENTS = new Set([
    "area", "base", "basefont", "bgsound", "br", "col", "embed", "frame", "hr",
    "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr",
]);
export const RAW_TEXT_ELEMENTS = new Set([
    "iframe", "noembed", "noframes", "noscript", "plaintext", "script", "style", "xmp",
]);
export const INLINE_ELEMENTS = new Set([
    "a", "abbr", "b", "bdi", "bdo", "big", "br", "cite", "code", "del", "dfn", "em",
    "font", "i", "img", "ins", "kbd", "label", "mark", "q", "s", "samp", "small",
    "span", "strike", "strong", "sub", "sup", "time", "tt", "u", "var", "wbr",
]);
export const TEXTBLOCK_ELEMENTS = new Set(["p", "h1", "h2", "h3", "h4", "h5", "h6", "figcaption"]);
export const BLOCK_CONTAINER_ELEMENTS = new Set(["li", "blockquote"]);
export const STRUCTURAL_ELEMENTS = new Set(["ul", "ol", "figure"]);
