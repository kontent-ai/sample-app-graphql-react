import get from "lodash.get";
import { Image, Layout, RichText, UnknownComponent } from "./components";
import { Container, makeStyles, Typography, useTheme } from "@material-ui/core";
import { useEffect, useState } from 'react';
import { fetchKontentItemWithLinkedItems } from './KontentDeliveryClient';
import getSeoData from './utils/getSeoData';

const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: theme.spacing(4)
    }
}));

function Post(props) {
    const [post, setPost] = useState(null);
    const [seo, setSeo] = useState({ });
    const [linkedItems, setLinkedItems] = useState(null);
    const classes = useStyles();
    const theme = useTheme();
    const imageSizes = `${theme.breakpoints.values.md}px`;
    useEffect( () => {
        async function fetchDeliverData() {
            const post = await fetchKontentItemWithLinkedItems(props.codename, 1);

            setPost(post.item);
            setSeo(getSeoData(post.item));
            setLinkedItems(post.linkedItems);
        }

        fetchDeliverData();
    }, [props.codename]);

    if (!post || !linkedItems) {
        return "loading...";
    }

    return (
        <Layout {...props} seo={seo}>
            <Container className={classes.root} maxWidth="md">
                {get(post, "title.value", null) && (
                    <Typography variant="h1">{get(post, "title.value", null)}</Typography>
                )}
                {get(post, "subtitle.value", null) && (
                    <Typography variant="subtitle1" >
                        <RichText
                            {...props}
                            richTextElement={get(post, "subtitle", null)}
                        />
                    </Typography>
                )}

                {get(post, "image.value[0]", null) && (
                    <div>
                        <Image
                            sizes={imageSizes}
                            asset={get(post, "image.value[0]", null)}
                            alt={get(post, "image.value[0].description") || get(post, "image.value[0].name", null)} />
                    </div>
                )}
                <Typography component="div">
                    <RichText
                        {...props}
                        linkedItems={linkedItems}
                        richTextElement={get(post, "content", null)}
                    />
                </Typography>

                <footer>
                    <time>{get(post, "publishing_date.value", null) && new Date(get(post, "publishing_date.value", null)).toDateString()}</time>
                    {get(post, "author.value[0]", null) &&
                    (", by " + get(post, "author.value[0].first_name.value", null) + " " + get(post, "author.value[0].last_name.value", null))}
                </footer>
            </Container>
        </Layout>
    );
}

export default Post;
