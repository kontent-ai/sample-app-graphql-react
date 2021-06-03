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
    navigationSeoFields,
    richTextFields,
} from './graphQLFragments';
import getSeo from './utils/getSeo';
import { useHistory } from 'react-router-dom';
import { getLanguage } from './utils/queryString';
import { languages } from './components/LanguageSelector';

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
                    system {
                        codename
                        type {
                            system {
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
                                            system {
                                                type {
                                                    system {
                                                        codename
                                                    }
                                                }
                                            }
                                            ... on BaseFormField {
                                                type {
                                                    system {
                                                        codename
                                                    }
                                                }
                                                name
                                                label
                                                defaultValue
                                                configuration {
                                                    system{
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
        query LandingPageQuery($codename: String!, $language: String!) {
            landingPage(codename: $codename, language: {language: $language}) {
                ...LandingPageFields
            }
        }
        ${landingPageFields}
        ${richTextFields}
        ${assetFields}
        ${actionFields}
        ${navigationSeoFields}
    `;

    const navigationAndLandingPageQuery = gql`
        query NavigationAndLandingPageQuery($codename: String!, $language: String!) {
            navigationItem(codename: $codename, language: {language: $language}){
                ...NavigationSeoFields
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
        ${navigationSeoFields}
    `;

    const classes = useStyles();

    const [sectionItems, setSectionItems] = useState(null);
    const [seo, setSeo] = useState({ });
    const language = getLanguage(useHistory().location);


    const { loading, error } = useQuery(props.seo ? landingPageQuery : navigationAndLandingPageQuery, {
        variables: { codename: props.codename, language: language || languages[0].codename},
        onCompleted: (data) => {
            if(props.seo) {
                setSectionItems(data.landingPage.sections.items);
                setSeo(props.seo);
            }
            else {
                setSectionItems(data.navigationItem.content.items[0].sections.items);
                setSeo(getSeo(data.navigationItem));
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
                    const contentType = upperFirst(camelCase(get(section, "system.type.system.codename", null)));
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
