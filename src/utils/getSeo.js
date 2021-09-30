import get from 'lodash.get';

export default function getSeo(seo) {
  const description = get(seo, "description", null); // pageProps
  const keyWords = get(seo, "keywords", null); // pageProps
  const canonicalUrl = get(seo, "canonicalUrl", null); // pageProps
  const noIndex = get(seo, "noIndex", null); // pageProps
  const title = get(seo, "title", null);

  return {
    description,
    keyWords,
    canonicalUrl,
    noIndex,
    title
  }
}
