import get from 'lodash.get';

export default function getSeo(data) {
  const description = get(data, "seoDescription", null); // pageProps
  const keyWords = get(data, "seoKeywords", null); // pageProps
  const canonicalUrl = get(data, "seoCanonicalUrl", null); // pageProps
  const noIndex = get(data, "seoNoIndex", null); // pageProps
  const title = get(data, "seoTitle", null);

  return {
    description,
    keyWords,
    canonicalUrl,
    noIndex,
    title
  }
}
