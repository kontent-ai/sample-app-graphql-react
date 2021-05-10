export default function getUrlFromMapping(mappings, codename) {
  const mapping = mappings.find(mapping => mapping.params.navigationItem.codename === codename);

  if (!mapping) {
    return undefined;
  }

  const path = mapping
    .params
    .slug
    .join("/");
  return "/" + path;
}