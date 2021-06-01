import { ImageUrlBuilder, ImageCompressionEnum } from "@kentico/kontent-delivery";


const kontentImageLoader = ({ src, width, quality }) => {
  // https://docs.kontent.ai/reference/image-transformation
  const builder = new ImageUrlBuilder(src)
    .withWidth(width)
    .withQuality(quality || 75)
    .withCompression(ImageCompressionEnum.Lossless)
    .withAutomaticFormat();

  return builder.getUrl();
};

export default kontentImageLoader;