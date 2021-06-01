const kontentAssetHostnames = [
  "assets-eu-01.kc-usercontent.com",
  "preview-assets-eu-01.kc-usercontent.com",
  "assets-us-01.kc-usercontent.com",
  "preview-assets-us-01.kc-usercontent.com"
];

const srcIsKontentAsset = (src) => {
  try {
    const srcUrl = new URL(src);
    return kontentAssetHostnames.includes(srcUrl.hostname);
  }
  catch {
    return false;
  }
};

export default srcIsKontentAsset;