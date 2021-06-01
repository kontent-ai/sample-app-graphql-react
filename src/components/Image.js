import { kontentImageLoader, srcIsKontentAsset } from "../utils";
import { useTheme } from "@material-ui/core";

const Image = (props) => {
  const deviceSizes = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
  const { asset, width, height, alt, sizes, loading } = props;
  const theme = useTheme();
  const componentWidth = width || asset.width || theme.breakpoints.values.md;
  const componentHeight = height || (componentWidth / asset.width) * asset.height || undefined;

  const imgProps = sizes && srcIsKontentAsset(asset.url) ? {
    sizes: sizes,
    srcSet: deviceSizes.map(size => `${kontentImageLoader({src: asset.url, width: size})} ${size}w`).join(", ")
  } : {
    width: componentWidth,
    height: componentHeight,
  };

  return <img src={asset.url} alt={alt} loading={loading} {...imgProps} style={{width: '100%'}}/>;
};

export default Image;
