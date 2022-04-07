export default function getUrlSlug(slugPartsArrayOrString) {
  const slugParts = [].concat(slugPartsArrayOrString);
  const slug = slugParts.join("/");

  if (!slug || slug === "/") {
    return process.env.PUBLIC_URL || "/"
  }

  const slugWithSlash = slug.startsWith("/") ? slug : `/${slug}`;

  return slugWithSlash.startsWith(process.env.PUBLIC_URL) ? slugWithSlash : `${process.env.PUBLIC_URL}${slugWithSlash}`;
}
