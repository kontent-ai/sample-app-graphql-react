export default function getUrlSlug(slugPartsArrayOrString) {
  const slugParts = [].concat(slugPartsArrayOrString);
  const slug = slugParts.join("/");

  return slug.startsWith("/") ? slug : `/${slug}`
}
