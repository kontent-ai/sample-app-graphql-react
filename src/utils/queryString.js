const pageSize = 3;
const authorQueryStringKey = "author";
const pageQueryStringKey = "page";

const getQueryString = (page, author) => `?page=${page > 0 ? page : 1}${author ? "&author=" + author : ""}`

export const getListingPaginationAndFilter = (location) => {
  const urlParams = new URLSearchParams(location.search);
  const authorQuery = urlParams.get(authorQueryStringKey);
  const pageQuery = urlParams.get(pageQueryStringKey);
  let pageNumber = parseInt(pageQuery);

  pageNumber = pageNumber > 0 ? pageNumber : 1;

  return {
    author: authorQuery,
    nextPage: `${location.pathname}${getQueryString(pageNumber + 1, authorQuery)}`,
    prevPage: `${location.pathname}${getQueryString(pageNumber - 1, authorQuery)}`,
    limit: pageSize,
    offset: (pageNumber - 1) * pageSize
  }
};

export const setAuthor = (location, author) => {
  const urlParams = new URLSearchParams(location.search);

  if(!author){
    urlParams.delete(authorQueryStringKey);
  }
  else{
    urlParams.set(authorQueryStringKey, author);
  }

  return {
    pathname: location.pathname,
    search: `?${urlParams}`
  };
};

export const getAuthor = (location) => {
  const urlParams = new URLSearchParams(location.search);

  return urlParams.get(authorQueryStringKey) || "";
};
