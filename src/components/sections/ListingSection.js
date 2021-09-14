import React, { useState } from "react";
import get from "lodash.get";
import upperFirst from "lodash.upperfirst";
import camelCase from "lodash.camelcase";
import { Card, CardContent, Container, Grid, makeStyles, Typography } from "@material-ui/core";
import thumbnails from "../thumbnails";
import { RichText, UnknownComponent, GraphQLLoader } from "..";
import { gql, useQuery } from '@apollo/client';
import { assetFields } from '../../graphQLFragments';

const useStyles = makeStyles((theme) => ({
  section: {
    padding: theme.spacing(2)
  },
  intro: {
    textAlign: "center"
  },
  itemCard: {
    height: "100%"
  }
}));

function ListingSection(props) {
  const listingSectionQuery = gql`
    query ListingSectionQuery($limit: Int) {
      postCollection(limit: $limit){
        items {
          _system {
            type {
              _system {
                codename
              }
            }
          }
          image {
            ...AssetFields
          }
          slug
          title
          excerpt
          publishingDate
          author(limit: 1) {
            items {
              ... on Author {
                firstName
                lastName
              }
            }
          }
        }
      }
    }
    
    ${assetFields}
  `;

  const section = get(props, "section", null);
  const classes = useStyles();

  const [relatedItemsData, setRelatedItemsData] = useState(null);

  const { loading, error } = useQuery(listingSectionQuery, {
    variables: { limit: props.section.numberOfItems },
    onCompleted: (data) => {
      setRelatedItemsData(data[`${props.section.contentType}Collection`].items)
    }
  }, [props.section.numberOfItems, props.section.contentType]);

  if(error || loading || !relatedItemsData) {
    return <GraphQLLoader error={error} loading={loading}/>;
  }

  return (
    <section id={get(section, "_system.codename", null)} className={classes.section}>
      <Container>
        <div className={classes.intro}>
          {get(section, "title", null) && (
            <Typography variant="h2">{get(section, "title", null)}</Typography>
          )}
          {get(section, "subtitle", null) && (
            <Typography variant="subtitle1">
              <RichText
                {...props}
                richTextElement={get(section, "subtitle", null)}
              />
            </Typography>
          )}
        </div>

        {relatedItemsData.length > 0 && (
          <Grid container spacing={2} alignItems="stretch">
            {relatedItemsData.map((item, item_idx) => {
              const contentType = upperFirst(camelCase(get(item, "_system.type._system.codename", null)));
              const ThumbnailLayout = thumbnails[contentType];

              if (process.env.NODE_ENV === "development" && !ThumbnailLayout) {
                console.error(`Unknown section component for section content type: ${contentType}`);
                return (
                  <Grid item md={4} sm={12} key={item_idx}>
                    <UnknownComponent key={item_idx} {...props}>
                      <pre>{JSON.stringify(item, undefined, 2)}</pre>
                    </UnknownComponent>
                  </Grid>

                );
              }

              return (
                <Grid item md={4} sm={12} key={item_idx}>
                  <Card className={classes.itemCard} >
                    <CardContent>
                      <ThumbnailLayout key={item_idx} {...props} item={item} columnCount={3} />
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </section>
  );
}

export default ListingSection;
