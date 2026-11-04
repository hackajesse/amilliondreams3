export const ALLOWED_ELEMENTS = {
    p: [],
    h2: [],
    h3: [],
    strong: [],
    em: [],
    br: [],
    hr: [],
    ul: [],
    ol: [],
    li: [],
    blockquote: [],
    a: ["href"],
    figure: [],
    img: ["src", "alt", "width", "height"],
    figcaption: [],
};
export const LOCKED_BLOCK_ATTRIBUTE = "data-raw-html";
export const LOCKED_BLOCK_OPEN_TAG = `<div ${LOCKED_BLOCK_ATTRIBUTE}>`;
export const LOCKED_BLOCK_CLOSE_TAG = "</div>";
const ALLOWED_HREF = /^(?:https?:|mailto:|\/(?!\/))/i;
const ALLOWED_IMAGE_SRC = /^(?:https:|\/(?!\/))/i;
const DIMENSION = /^\d+$/;
export function isAllowedElement(tag) {
    return Object.hasOwn(ALLOWED_ELEMENTS, tag);
}
export function allowedAttributes(tag) {
    return isAllowedElement(tag) ? ALLOWED_ELEMENTS[tag] : [];
}
export function isAllowedHref(href) {
    return ALLOWED_HREF.test(href);
}
export function isAllowedImageSrc(src) {
    return ALLOWED_IMAGE_SRC.test(src);
}
export function isAllowedDimension(value) {
    return DIMENSION.test(value);
}
