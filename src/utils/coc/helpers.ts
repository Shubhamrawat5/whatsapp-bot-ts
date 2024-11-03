/* eslint-disable */

export const isValidTag = (tag: string) =>
  /^#[PYLQGRJCUV0289]{3,9}$/g.test(tag);

export const resolveTag = (tag: string) =>
  `#${tag
    .toUpperCase()
    .replace(/[#]/g, "")
    .replace(/[\s]/g, "")
    .replace(/[O]/g, "0")}`;

export const encodeTag = (tag: string) => tag.replace("#", "%23");
