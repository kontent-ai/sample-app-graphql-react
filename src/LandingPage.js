import get from "lodash.get";
import upperFirst from "lodash.upperfirst";
import camelCase from "lodash.camelcase";
import { Layout, UnknownComponent } from "./components";
import sections from "./components/sections";
import { Box, makeStyles } from "@material-ui/core";
import { useEffect, useState } from 'react';
import { fetchKontentItemsByCodenames } from './KontentDeliveryClient';

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
    const sectionItemCodenames = get(props.content, "sections.itemCodenames", []);

    const [sectionItemsByCodename, setSectionItems] = useState(null);
    const [linkedItems, setLinkedItems] = useState(null);

    useEffect( () => {
        async function fetchDeliverData() {
            const sectionItems = await fetchKontentItemsByCodenames(sectionItemCodenames, 3);

            setSectionItems(sectionItems.items);
            setLinkedItems(sectionItems.linkedItems);
        }

        fetchDeliverData();
    }, [props.content]);

    if(!sectionItemsByCodename) {
        return "loading...";
    }

    return (
        <Layout {...props}>
            <Box className={classes.sections}>
                {sectionItemCodenames.map((sectionCodename, index) => {
                    const section = sectionItemsByCodename[sectionCodename];
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
