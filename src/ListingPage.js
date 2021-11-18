import get from "lodash.get";
import upperFirst from "lodash.upperfirst";
import camelCase from "lodash.camelcase";
import {
  Layout,
  UnknownComponent,
  Link,
  Filter,
  GraphQLLoader,
} from "./components";
import { Container, Grid, makeStyles, Paper } from "@material-ui/core";
import * as thumbnailLayouts from "./components/thumbnails";
import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { assetFields, seoFields } from "./graphQLFragments";
import getSeo from "./utils/getSeo";
import { getAuthor, setAuthor } from "./utils/queryString";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  thumbnailPaper: {
    height: "100%",
    padding: theme.spacing(2),
  },
  pagination: {
    marginTop: theme.spacing(2),
    display: "flex",
    justifyContent: "space-between",
  },
}));

function ListingPage(props) {
  const listingPageQuery = gql`
        # TODO add persona once https://kentico.atlassian.net/browse/DEL-3086 is done
        query ListingPageQuery($limit: Int, $offset: Int, $codename: String! ${
          props.author ? ", $author: String!" : ""
        }){
            author_All {
                items {
                    firstName
                    lastName
                    _system_ {
                        codename
                    }
                }
            }
            # TODO add persona once https://kentico.atlassian.net/browse/DEL-3086 is done
            post_All(limit: $limit, offset: $offset, ${
              props.author ? "where: {author: {containsAny: [$author]} }" : ""
            }) {
                items {
                    _system_ {
                        type {
                            _system_ {
                                codename
                            }
                        }
                        codename
                    }
                    image {
                        ...AssetFields
                    }
                    title
                    slug
                    excerpt
                    publishingDate
                    author {
                        ... on Author {
                            firstName
                            lastName
                        }
                    }
                }
            }
            navigationItem(codename: $codename) {
                _seo {
                  ...SeoFields
                }
                content {
                  ... on ListingPage {
                      contentType
                  }
                }
            }
        }

        ${assetFields}
        ${seoFields}
    `;

  const classes = useStyles();

  const [relatedItems, setRelatedItems] = useState([]);
  const [authors, setAuthors] = useState([]);
  // const [personas, setPersonas] = useState([]);
  const [seo, setSeo] = useState(null);

  const { loading, error, data } = useQuery(
    listingPageQuery,
    {
      variables: {
        codename: props.codename,
        author: props.author,
        /* persona: props.persona,*/ limit: props.limit,
        offset: props.offset,
      },
      onCompleted: (data) => {
        const collection =
          data[`${data.navigationItem.content.contentType}_All`];
        if (collection) {
          setRelatedItems(collection.items);
        } else {
          setRelatedItems(null);
        }

        setAuthors(
          data.author_All.items.map((author) => {
            return {
              name: `${author.firstName} ${author.lastName}`,
              codename: author._system_.codename,
            };
          })
        );

        // TODO update hardcoded personas and load them from Kontent
        // setPersonas([{
        //     name: "Developer",
        //     codename: "developer"
        // }]);

        setSeo(getSeo(data.navigationItem._seo));
      },
    },
    [props.codename, props.author, props.persona, props.limit, props.offset]
  );

  if (error || loading || !seo) {
    return <GraphQLLoader error={error} loading={loading} />;
  }

  if (relatedItems == null) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        `Unknown listing contentType: ${data.navigationItem.content.contentType}`
      );
      return (
        <UnknownComponent {...props}>
          <pre>{JSON.stringify(data, undefined, 2)}</pre>
        </UnknownComponent>
      );
    }
  }

  return (
    <Layout {...props} seo={seo}>
      <Container className={classes.root}>
        <Filter
          label="Author"
          parameterName="author"
          options={authors}
          updateLocation={setAuthor}
          getValueFromLocation={getAuthor}
        />
        {/* <Filter label="Persona" parameterName="persona" options={personas} updateLocation={setPersona} getValueFromLocation={getPersona} /> */}
        {relatedItems.length > 0 && (
          <Grid container spacing={4} alignItems="stretch">
            {relatedItems.map((item, item_idx) => {
              const contentType = upperFirst(
                camelCase(get(item, "_system_.type._system_.codename", null))
              );
              const ThumbnailLayout = thumbnailLayouts[contentType];
              if (process.env.NODE_ENV === "development" && !ThumbnailLayout) {
                console.error(
                  `Unknown section component for section content type: ${contentType}`
                );
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
                    <ThumbnailLayout
                      {...props}
                      item={item}
                      site={props}
                      columnCount={3}
                    />
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        )}
        <div className={classes.pagination}>
          <Link href={props.prevPage}>Previous page</Link>
          <Link href={props.nextPage}>Next page</Link>
        </div>
      </Container>
    </Layout>
  );
}

export default ListingPage;
