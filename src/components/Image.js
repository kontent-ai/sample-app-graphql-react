import { kontentImageLoader, srcIsKontentAsset } from "../utils";
import { useTheme } from "@material-ui/core";

const Image = (props) => {
  const deviceSizes = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
  const { asset, width, height, alt, sizes, loading } = props;
  const theme = useTheme();
  const componentWidth = width || asset.width || theme.breakpoints.values.md;
  const componentHeight = height || (componentWidth / asset.width) * asset.height;

  const imgProps = sizes && srcIsKontentAsset(asset.url) ? {
    src: asset.url,
    alt: alt,
    sizes: sizes,
    loading: loading,
    srcset: deviceSizes.map(size => `${kontentImageLoader({src: asset.url, width: size})} ${size}w`).join(", ")
  } : {
    src: asset.url,
    width: componentWidth,
    height: componentHeight,
    alt: alt,
    loading: loading
  };

  return <img {...imgProps} style={{width: '100%'}}/>;
};

export default Image;
