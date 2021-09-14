import { gql } from '@apollo/client';

export const subpageNavigationItemFields = gql`
    fragment SubpageNavigationItemFields on NavigationItem {
       _system {
            codename
        }
        slug
        content {
            items {
               _system {
                    codename
                    type {
                       _system {
                            codename
                        }
                    }
                }

                ... on ListingPage {
                    contentType
                }
            }
        }
    }
`;

export const richTextFields = gql`
    fragment RichTextFields on RichText {
        links {
            items {
               _system {
                    id
                    codename
                    type {
                       _system {
                            codename
                        }
                    }
                }
            }
        }
        html
        assets {
            items {
                ...AssetFields
            }
        }
        components {
            items {
               _system {
                    id
                    codename
                    type {
                       _system {
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

export const postSeoFields = gql`
    fragment PostSeoFields on Post {
        seoCanonicalUrl
        seoDescription
        seoKeywords
        seoOptions {
           _system {
                codename
            }
        }
        seoTitle
    }
`;

export const homePageSeoFields = gql`
    fragment HomePageSeoFields on Homepage {
        seoCanonicalUrl
        seoDescription
        seoKeywords
        seoOptions {
           _system {
                codename
            }
        }
        seoTitle
    }
`;

export const navigationSeoFields = gql`
    fragment NavigationSeoFields on NavigationItem {
        seoCanonicalUrl
        seoDescription
        seoKeywords
        seoOptions {
           _system {
                codename
            }
        }
        seoTitle
    }
`;

export const actionFields = gql`
    fragment ActionFields on Action {
       _system {
            codename
        }
        label
        navigationItem {
            items {
               _system {
                    type {
                       _system {
                            codename
                        }
                    }
                }
                ... on ExternalUrl {
                    url
                }
                ... on NavigationItem {
                    ...NavigationSeoFields
                    label
                    slug
                    content {
                        items {
                           _system {
                                codename
                                type {
                                   _system {
                                        codename
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        options {
           _system {
                codename
            }
        }
        role {
           _system {
                codename
            }
        }
        icon {
            items {
                ... on Icon {
                    iconPosition {
                       _system {
                            codename
                        }
                    }
                   _system {
                        codename
                    }
                    icon {
                       _system {
                            codename
                        }
                    }
                }
            }
        }
    }
`;

export const assetFields = gql`
    fragment AssetFields on Asset {
        url
        name
        description
        imageId
    }
`;
