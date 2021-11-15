import get from "lodash.get";
import upperFirst from "lodash.upperfirst";
import camelCase from "lodash.camelcase";
import { Layout, UnknownComponent, GraphQLLoader } from "./components";
import * as sections from "./components/sections";
import { Box, makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import {
  actionFields,
  assetFields,
  seoFields,
  richTextFields,
  richTextAssetFields,
} from "./graphQLFragments";
import getSeo from "./utils/getSeo";

const useStyles = makeStyles((theme) => ({
  sections: {
    "& > section:first-child": {
      paddingTop: theme.spacing(8),
      paddingBottom: theme.spacing(8),
    },
  },
}));

function LandingPage(props) {
  const landingPageFields = gql`
    fragment LandingPageFields on LandingPage {
      __typename
      sections {
        items {
          # https://github.com/apollographql/apollo-client/issues/7648#issuecomment-968969367
          __typename
          ... on CtaSection {
            _system_ {
              codename
              type {
                _system_ {
                  codename
                }
              }
            }
            title
            subtitle {
              __typename
              ...RichTextFields
            }
            action {
              __typename
              ...ActionFields
            }
          }
          ... on FeaturesSection {
            _system_ {
              codename
              type {
                _system_ {
                  codename
                }
              }
            }
            title
            subtitle {
              __typename
              ...RichTextFields
            }
            features {
              items {
                __typename
                ... on Feature {
                  image {
                    __typename
                    ...AssetFields
                  }
                  title
                  content {
                    __typename
                    ...RichTextFields
                  }
                  actions {
                    items {
                      __typename
                      ...ActionFields
                    }
                  }
                }
              }
            }
          }
          ... on ContactSection {
            _system_ {
              codename
              type {
                _system_ {
                  codename
                }
              }
            }
            title
            subtitle {
              __typename
              ...RichTextFields
            }
            content {
              __typename
              ...RichTextFields
            }
            form {
              __typename
              ... on Form {
                formId
                formAction
                submitLabel
                fields {
                  items {
                    __typename
                    ... on BaseFormField {
                      _system_ {
                        type {
                          _system_ {
                            codename
                          }
                        }
                      }
                      type {
                        items {
                          _system_ {
                            codename
                          }
                        }
                      }
                      name
                      label
                      defaultValue
                      configuration {
                        items {
                          _system_ {
                            codename
                          }
                        }
                      }
                    }
                    ... on SelectFormField {
                      _system_ {
                        type {
                          _system_ {
                            codename
                          }
                        }
                      }
                      label
                      options {
                        items {
                          __typename
                          ... on SelectFormFieldOption {
                            label
                            value
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          ... on HeroSection {
            _system_ {
              codename
              type {
                _system_ {
                  codename
                }
              }
            }
            image {
              __typename
              ...AssetFields
            }
            title
            content {
              __typename
              ...RichTextFields
            }
            actions {
              items {
                __typename
                ...ActionFields
              }
            }
          }
          ... on ContentSection {
            _system_ {
              codename
              type {
                _system_ {
                  codename
                }
              }
            }
            image {
              __typename
              ...AssetFields
            }
            title
            content {
              __typename
              ...RichTextFields
            }
            actions {
              items {
                __typename
                ...ActionFields
              }
            }
          }
          ... on ListingSection {
            _system_ {
              codename
              type {
                _system_ {
                  codename
                }
              }
            }
            title
            subtitle {
              __typename
              ...RichTextFields
            }
            orderBy
            contentType
            numberOfItems
          }
        }
      }
    }
  `;

  const landingPageQuery = gql`
    query LandingPageQuery($codename: String!) {
      landingPage(codename: $codename) {
        ...LandingPageFields
      }
    }
    ${landingPageFields}
    ${richTextFields}
    ${richTextAssetFields}
    ${assetFields}
    ${actionFields}
    ${seoFields}
  `;

  const navigationAndLandingPageQuery = gql`
    query NavigationAndLandingPageQuery($codename: String!) {
      navigationItem(codename: $codename) {
        _seo {
          ...SeoFields
        }
        content {
          __typename
          ... on LandingPage {
            ...LandingPageFields
          }
        }
      }
    }
    ${landingPageFields}
    ${richTextFields}
    ${richTextAssetFields}
    ${assetFields}
    ${actionFields}
    ${seoFields}
  `;

  const classes = useStyles();

  const [sectionItems, setSectionItems] = useState(null);
  const [seo, setSeo] = useState({});

  const { loading, error } = useQuery(
    props.seo ? landingPageQuery : navigationAndLandingPageQuery,
    {
      variables: { codename: props.codename },
      onCompleted: (data) => {
        if (props.seo) {
          setSectionItems(data.landingPage.sections.items);
          setSeo(props.seo);
        } else {
          setSectionItems(data.navigationItem.content.sections.items);
          setSeo(getSeo(data.navigationItem._seo));
        }
      },
    },
    [props.codename, props.seo]
  );

  if (error || loading || !sectionItems) {
    return <GraphQLLoader error={error} loading={loading} />;
  }

  return (
    <Layout {...props} seo={seo}>
      <Box className={classes.sections}>
        {sectionItems.map((section, index) => {
          const contentType = upperFirst(
            camelCase(get(section, "_system_.type._system_.codename", null))
          );
          const Component = sections[contentType];

          if (process.env.NODE_ENV === "development" && !Component) {
            console.error(
              `Unknown section component for section content type: ${contentType}`
            );
            return (
              <UnknownComponent key={index} {...props}>
                <pre>{JSON.stringify(section, undefined, 2)}</pre>
              </UnknownComponent>
            );
          }

          return (
            <Component key={index} {...props} section={section} site={props} />
          );
        })}
      </Box>
    </Layout>
  );
}

export default LandingPage;
