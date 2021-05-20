import get from "lodash.get";
import upperFirst from "lodash.upperfirst";
import camelCase from "lodash.camelcase";
import { Layout, UnknownComponent } from "./components";
import sections from "./components/sections";
import { Box, makeStyles } from "@material-ui/core";
import { useEffect, useState } from 'react';
import { fetchKontentItem, fetchKontentItemsByCodenames } from './KontentDeliveryClient';
import getSeoData from './utils/getSeoData';

const useStyles = makeStyles((theme) => ({
    sections: {
        "& > section:first-child": {
            paddingTop: theme.spacing(8),
            paddingBottom: theme.spacing(8)
        }
    }
}));

function LandingPage(props) {
    const classes = useStyles();

    const [sectionItems, setSectionItems] = useState(null);
    const [seo, setSeo] = useState({ });
    const [linkedItems, setLinkedItems] = useState(null);

    useEffect( () => {
        async function fetchDeliverData() {
            const item = await fetchKontentItem(props.codename, 1);
            setSeo(getSeoData(item));
            const sectionItemCodenames = get(item, "content.value[0].sections.itemCodenames", []);

            const sectionItems = await fetchKontentItemsByCodenames(sectionItemCodenames, 3);

            setSectionItems(sectionItemCodenames.map(section => sectionItems.items[section]));
            setLinkedItems(sectionItems.linkedItems);
        }

        fetchDeliverData();
    }, [props.codename]);

    if(!sectionItems) {
        return "loading...";
    }

    return (
        <Layout {...props} seo={seo}>
            <Box className={classes.sections}>
                {sectionItems.map((section, index) => {
                    const contentType = upperFirst(camelCase(get(section, "system.type", null)));
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
                        <Component key={index} {...props} section={section} site={props} linkedItems={linkedItems} />
                    );
                })
                }
            </Box>
        </Layout>
    );
}

export default LandingPage;
