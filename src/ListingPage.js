import get from "lodash.get";
import upperFirst from "lodash.upperfirst";
import camelCase from "lodash.camelcase";
import { Layout, UnknownComponent } from "./components";
import { Container, Grid, makeStyles, Paper } from "@material-ui/core";
import thumbnailLayouts from "./components/thumbnails";
import { useEffect, useState } from 'react';
import { fetchItemsByContentType, fetchKontentItem } from './KontentDeliveryClient';
import getSeoData from './utils/getSeoData';


const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  thumbnailPaper: {
    height: "100%",
    padding: theme.spacing(2),
  }
}));

function ListingPage(props) {
  const classes = useStyles();

  const [relatedItems, setRelatedItems] = useState([]);
  const [seo, setSeo] = useState({ });

  useEffect( () => {
      async function fetchDeliverData() {
          const item = await fetchKontentItem(props.codename, 1);
          const contentType = get(item, "content.value[0].content_type.value", null);

          const relatedData = await fetchItemsByContentType(contentType);
          setRelatedItems(relatedData);
          setSeo(getSeoData(item));
      }

      fetchDeliverData();
  }, [props.codename]);

    if (!relatedItems) {
        return "loading...";
    }

  return (
      <Layout {...props} seo={seo}>
        <Container className={classes.root}>
          {relatedItems.length > 0 &&
          <Grid container spacing={4} alignItems="stretch">
            {relatedItems.map((item, item_idx) => {
              const contentType = upperFirst(camelCase(get(item, "system.type", null)));

              const ThumbnailLayout = thumbnailLayouts[contentType];
              if (process.env.NODE_ENV === "development" && !ThumbnailLayout) {
                console.error(`Unknown section component for section content type: ${contentType}`);
                return (
                    <Grid item md={4} sm={12} key={item_idx}>
                      <Paper className={classes.thumbnailPaper}>
                        <UnknownComponent {...props}>
                          <pre>{JSON.stringify(item, undefined, 2)}</pre>
                        </UnknownComponent>
                      </Paper>

                    </Grid>
                );
              }

              return (
                  <Grid variant="inbound" item md={4} sm={12} key={item_idx}>
                    <Paper className={classes.thumbnailPaper}>
                      <ThumbnailLayout  {...props} item={item} site={props} columnCount={3}/>
                    </Paper>
                  </Grid>
              );
            })}
          </Grid>
          }
        </Container>
      </Layout>
  );
}

export default ListingPage;
