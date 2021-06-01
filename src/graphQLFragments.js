import { gql } from '@apollo/client';

export const subpageNavigationItemFields = gql`
    fragment SubpageNavigationItemFields on NavigationItem {
        system {
            codename
        }
        slug
        content {
            items {
                system {
                    codename
                    type {
                        system {
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
                system {
                    id
                    codename
                    type {
                        system {
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
                system {
                    id
                    codename
                    type {
                        system {
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
            system {
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
            system {
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
            system {
                codename
            }
        }
        seoTitle
    }
`;

export const actionFields = gql`
    fragment ActionFields on Action {
        system {
            codename
        }
        label
        navigationItem {
            items {
                system {
                    type {
                        system {
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
                            system {
                                codename
                                type {
                                    system {
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
            system {
                codename
            }
        }
        role {
            system {
                codename
            }
        }
        icon {
            items {
                ... on Icon {
                    iconPosition {
                        system {
                            codename
                        }
                    }
                    system {
                        codename
                    }
                    icon {
                        system {
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
