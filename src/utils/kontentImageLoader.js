import { transformImageUrl } from '@kontent-ai/delivery-sdk';


const kontentImageLoader = ({ src, width, quality }) => {
  // https://docs.kontent.ai/reference/image-transformation
  const builder = transformImageUrl(src)
    .withWidth(width)
    .withQuality(quality || 75)
    .withCompression('lossless')
    .withAutomaticFormat();

  return builder.getUrl();
};

export default kontentImageLoader;