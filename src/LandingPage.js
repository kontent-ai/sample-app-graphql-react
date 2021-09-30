import get from "lodash.get";
import upperFirst from "lodash.upperfirst";
import camelCase from "lodash.camelcase";
import { Layout, UnknownComponent, GraphQLLoader } from "./components";
import sections from "./components/sections";
import { Box, makeStyles } from "@material-ui/core";
import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import {
    actionFields,
    assetFields,
    seoFields,
    richTextFields,
} from './graphQLFragments';
import getSeo from './utils/getSeo';

const useStyles = makeStyles((theme) => ({
    sections: {
        "& > section:first-child": {
            paddingTop: theme.spacing(8),
            paddingBottom: theme.spacing(8)
        }
    }
}));

function LandingPage(props) {
    const landingPageFields = gql`
        fragment LandingPageFields on LandingPage {
            sections {
                items {
                    _system {
                        codename
                        type {
                            _system {
                                codename
                            }
                        }
                    }
                    ... on CtaSection {
                        title
                        subtitle{
                            ...RichTextFields
                        }
                        action {
                            items {
                                ...ActionFields
                            }
                        }
                    }
                    ... on FeaturesSection {
                        title
                        subtitle {
                            ...RichTextFields
                        }
                        features {
                            items {
                                ... on Feature {
                                    image {
                                        ...AssetFields
                                    }
                                    title
                                    content{
                                        ...RichTextFields
                                    }
                                    actions {
                                        items {
                                            ...ActionFields
                                            
                                        }
                                        
                                    }
                                    
                                }
                            }
                        }
                    }
                    ... on ContactSection {
                        title
                        subtitle {
                            ...RichTextFields
                        }
                        content {
                            ...RichTextFields
                        }
                        form {
                            items {
                                ... on Form {
                                    formId
                                    formAction
                                    submitLabel
                                    fields {
                                        items{
                                            _system {
                                                type {
                                                    _system {
                                                        codename
                                                    }
                                                }
                                            }
                                            ... on BaseFormField {
                                                type {
                                                    _system {
                                                        codename
                                                    }
                                                }
                                                name
                                                label
                                                defaultValue
                                                configuration {
                                                    _system {
                                                        codename
                                                    }
                                                }
                                            }
                                            ... on SelectFormField {
                                                label
                                                options {
                                                    items {
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
                    }
                    ... on HeroSection {
                        image {
                            ...AssetFields
                        }
                        title
                        content {
                            ...RichTextFields
                        }
                        actions {
                            items {
                                ...ActionFields
                            }
                        }
                    }
                    ... on ContentSection {
                        image {
                            ...AssetFields
                        }
                        title
                        content {
                            ...RichTextFields
                        }
                        actions {
                            items {
                                ...ActionFields
                            }
                        }
                    }
                    ... on ListingSection {
                        title
                        subtitle {
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
        ${assetFields}
        ${actionFields}
        ${seoFields}
    `;

    const navigationAndLandingPageQuery = gql`
        query NavigationAndLandingPageQuery($codename: String!) {
            navigationItem(codename: $codename){
                seo {
                    ...SeoFields
                }
                content {
                    items {
                        ... on LandingPage {
                            ...LandingPageFields
                        }
                    }
                }
            }

        }
        ${landingPageFields}
        ${richTextFields}
        ${assetFields}
        ${actionFields}
        ${seoFields}
    `;

    const classes = useStyles();

    const [sectionItems, setSectionItems] = useState(null);
    const [seo, setSeo] = useState({ });

    const { loading, error } = useQuery(props.seo ? landingPageQuery : navigationAndLandingPageQuery, {
        variables: { codename: props.codename },
        onCompleted: (data) => {
            if(props.seo) {
                setSectionItems(data.landingPage.sections.items);
                setSeo(props.seo);
            }
            else {
                setSectionItems(data.navigationItem.content.items[0].sections.items);
                setSeo(getSeo(data.navigationItem.seo));
            }
        }
    }, [props.codename, props.seo]);

    if(error || loading || !sectionItems) {
        return <GraphQLLoader error={error} loading={loading}/>;
    }

    return (
        <Layout {...props} seo={seo}>
            <Box className={classes.sections}>
                {sectionItems.map((section, index) => {
                    const contentType = upperFirst(camelCase(get(section, "_system.type._system.codename", null)));
                    const Component = sections[contentType];

                    if (process.env.NODE_ENV === "development" && !Component) {
                        console.error(`Unknown section component for section content type: ${contentType}`);
                        return (
                            <UnknownComponent key={index} {...props}>
                                <pre>{JSON.stringify(section, undefined, 2)}</pre>
                            </UnknownComponent>
                        );
                    }

                    return (
                        <Component key={index} {...props} section={section} site={props} />
                    );
                })
                }
            </Box>
        </Layout>
    );
}

export default LandingPage;
