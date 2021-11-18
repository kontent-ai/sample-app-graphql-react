export default function getUrlSlug(slugPartsArrayOrString) {
  const slugParts = [].concat(slugPartsArrayOrString);
  const slug = slugParts.join("/");

  if (!slug || slug === "/") {
    return process.env.PUBLIC_URL || "/"
  }

  return process.env.PUBLIC_URL + (slug.startsWith("/") ? slug : `/${slug}`)
}
