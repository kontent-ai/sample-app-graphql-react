import get from "lodash.get";
import { Image, Layout, RichText } from "./components";
import { Container, makeStyles, Typography, useTheme } from "@material-ui/core";
import React, { useEffect, useState } from 'react';
import { fetchKontentItemWithLinkedItems } from './KontentDeliveryClient';
import LandingPage from './LandingPage';
import getSeoData from './utils/getSeoData';

const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: theme.spacing(4)
    }
}));

function SimplePage(props) {
    const classes = useStyles();

    const [page, setPage] = useState(null);
    const [seo, setSeo] = useState({ });
    const [linkedItems, setLinkedItems] = useState(null);

    useEffect( () => {
        async function fetchDeliverData() {
            const pageData = await fetchKontentItemWithLinkedItems(props.codename, 3);
            setPage(get(pageData, "item.content.value[0]", null));
            setSeo(getSeoData(pageData.item));
            setLinkedItems(pageData.linkedItems);
        }

        fetchDeliverData();
    }, [props.codename]);

    const theme = useTheme();
    const imageSizes = `${theme.breakpoints.values.md}px`;

    if (!page || !linkedItems) {
        return "loading...";
    }

    return (
        <Layout {...props} seo={seo}>
            <Container className={classes.root} maxWidth="md">
                {get(page, "title.value", null) && (
                    <Typography variant="h1">{get(page, "title.value", null)}</Typography>
                )}
                {get(page, "subtitle.value", null) && (
                    <Typography variant="subtitle1" >
                        {get(page, "subtitle.value")}
                    </Typography>
                )}

                {get(page, "image.value[0]", null) && (
                    <div>
                        <Image
                            sizes={imageSizes}
                            asset={(get(page, "image.value[0]", null))}
                            alt={get(page, "image.value[0].description") || get(page, "image.value[0].name", null)} />
                    </div>
                )}
                <Typography component="div">
                    <RichText
                        richTextElement={get(page, "content", null)}
                        linkedItems={linkedItems}
                        mappings={props.mappings}
                    />
                </Typography>
            </Container>
        </Layout>
    );
}

export default SimplePage;
