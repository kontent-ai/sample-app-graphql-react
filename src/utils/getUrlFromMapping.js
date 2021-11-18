export function getUrlFromMappingByCodename(mappings, codename) {
  return Object.keys(mappings).find(key => mappings[key].navigationCodename === codename);
}

export function getUrlFromMappingByPathName(mappings, pathname) {
  debugger;
  
  let unifiedPath = pathname;

  if (pathname.startsWith(process.env.PUBLIC_URL)) {
    unifiedPath = pathname.replace(process.env.PUBLIC_URL, "");
  }

  unifiedPath = unifiedPath.startsWith("/") ? unifiedPath.substring(1) : unifiedPath;

  return mappings[unifiedPath];
}