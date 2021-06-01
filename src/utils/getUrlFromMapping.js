export default function getUrlFromMapping(mappings, codename) {
  return Object.keys(mappings).find(key => mappings[key].codename === codename);
}
