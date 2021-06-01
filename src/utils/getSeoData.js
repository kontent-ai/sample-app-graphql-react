import get from 'lodash.get';

export default function getSeoData(item) {
  const description = get(item, "seo__description.value", null); // pageProps
  const keyWords = get(item, "seo__keywords.value", null); // pageProps
  const canonicalUrl = get(item, "seo__canonical_url.value", null); // pageProps
  const noIndex = get(item, "seo__no_index.value", null); // pageProps
  const title = get(item, "seo__title.value", null);

  return {
    description,
    keyWords,
    canonicalUrl,
    noIndex,
    title
  }
}
