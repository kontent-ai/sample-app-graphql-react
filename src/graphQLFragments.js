import { gql } from "@apollo/client";

export const subpageNavigationItemFields = gql`
  fragment SubpageNavigationItemFields on NavigationItem {
    __typename
    _system_ {
      codename
    }
    slug
    content {
      # https://github.com/apollographql/apollo-client/issues/7648#issuecomment-968969367
      __typename
      ... on SimplePage {
        _system_ {
          codename
          type {
            _system_ {
              codename
            }
          }
        }
      }
      ... on LandingPage {
        _system_ {
          codename
          type {
            _system_ {
              codename
            }
          }
        }
      }
      ... on ListingPage {
        _system_ {
          codename
          type {
            _system_ {
              codename
            }
          }
        }
        contentType
      }
    }
  }
`;

export const richTextFields = gql`
  fragment RichTextFields on _RichText {
    itemHyperlinks {
      items {
        __typename
        _system_ {
          id
          codename
          type {
            _system_ {
              codename
            }
          }
        }
      }
    }
    html
    assets {
      items {
        __typename
        ...RichTextAssetFields
      }
    }
    components {
      items {
        __typename
        _system_ {
          id
          codename
          type {
            _system_ {
              codename
            }
          }
        }
        ... on Quote {
          quoteText
        }
        ... on CodeBlock {
          code {
            html
          }
        }
      }
    }
  }
`;

export const seoFields = gql`
  fragment SeoFields on Seo {
    canonicalUrl
    description
    keywords
    options {
      items {
        _system_ {
          codename
        }
      }
    }
    title
  }
`;

export const actionFields = gql`
  fragment ActionFields on Action {
    _system_ {
      codename
    }
    label
    navigationItem {
      # https://github.com/apollographql/apollo-client/issues/7648#issuecomment-968969367
      __typename
      ... on ExternalUrl {
        _system_ {
          type {
            _system_ {
              codename
            }
          }
        }
        url
      }
      ... on NavigationItem {
        _system_ {
          type {
            _system_ {
              codename
            }
          }
        }
        _seo {
          ...SeoFields
        }
        label
        slug
        content {
          # https://github.com/apollographql/apollo-client/issues/7648#issuecomment-968969367
          __typename
          ... on SimplePage {
            _system_ {
              codename
              type {
                _system_ {
                  codename
                }
              }
            }
          }
          ... on LandingPage {
            _system_ {
              codename
              type {
                _system_ {
                  codename
                }
              }
            }
          }
          ... on ListingPage {
            _system_ {
              codename
              type {
                _system_ {
                  codename
                }
              }
            }
          }
        }
      }
    }
    options {
      items {
        _system_ {
          codename
        }
      }
    }
    role {
      items {
        _system_ {
          codename
        }
      }
    }
    icon {
      ... on Icon {
        iconPosition {
          items {
            _system_ {
              codename
            }
          }
        }
        _system_ {
          codename
        }
        icon {
          items {
            _system_ {
              codename
            }
          }
        }
      }
    }
  }
`;

export const assetFields = gql`
  fragment AssetFields on _Asset {
    url
    name
    description
  }
`;

export const richTextAssetFields = gql`
  fragment RichTextAssetFields on _RichTextAsset {
    url
    name
    description
    imageId
  }
`;
