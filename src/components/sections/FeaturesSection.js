import React, { useState } from "react";
import {
  actionFields,
  assetFields,
  richTextFields,
} from "../../graphQLFragments";
import get from "lodash.get";
import {
  Container,
  Grid,
  makeStyles,
  Typography,
  useTheme,
} from "@material-ui/core";
import { CtaButtons, GraphQLLoader, Image, RichText } from "..";
import { gql, useQuery } from "@apollo/client";

const useStyles = makeStyles((theme) => ({
  section: {
    padding: theme.spacing(8),
  },
  row: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  image: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  intro: {
    textAlign: "center",
  },
  alignRight: {
    textAlign: "right",
  },
}));

function FeaturesSection(props) {
  const query = gql`
    query FeaturesSectionQuery($codename: String!, $languageCodename: String!) {
      featuresSection(
        codename: $codename
        languageFilter: { languageCodename: $languageCodename }
      ) {
        title
        subtitle {
          ...RichTextFields
        }
        features(limit: 5) {
          items {
            ... on Feature {
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
          }
        }
      }
    }

    ${richTextFields}
    ${assetFields}
    ${actionFields}
  `;

  const classes = useStyles();

  const theme = useTheme();
  const imageSizes = `(min-width: ${theme.breakpoints.values.sm}px) 40vw, 100vw`;

  const [section, setSection] = useState(null);

  const { loading, error } = useQuery(
    query,
    {
      variables: {
        codename: props.section._system_.codename,
        languageCodename: props.section._system_.language._system_.codename,
      },
      onCompleted: (data) => {
        setSection(data.featuresSection);
      },
    },
    [props.section.codename, props.section.languageCodename]
  );

  if (error || loading || !section) {
    return <GraphQLLoader error={error} loading={loading} />;
  }
  return (
    <section
      id={get(section, "_system_.codename", null)}
      className={classes.section}
    >
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

        {get(section, "features.items[0]", null) &&
          get(section, "features.items", []).map((feature, index) => (
            <Grid
              container
              spacing={2}
              alignItems="center"
              key={index}
              direction={index % 2 ? "row-reverse" : "row"}
              className={classes.row}
            >
              {get(feature, "image", null) && (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  className={`${classes.column}, ${classes.image}`}
                >
                  <Image
                    sizes={imageSizes}
                    asset={get(feature, "image", null)}
                    alt={
                      get(feature, "image.description") ||
                      get(feature, "image.name")
                    }
                  />
                </Grid>
              )}

              <Grid
                item
                xs={12}
                sm={4}
                className={`${classes.column} ${
                  index % 2 ? classes.alignRight : undefined
                }`}
              >
                <Typography variant="h3">
                  {get(feature, "title", null)}
                </Typography>

                <RichText
                  component="div"
                  {...props}
                  richTextElement={get(feature, "content", null)}
                />

                {get(feature, "actions.items[0]", null) && (
                  <CtaButtons actions={get(feature, "actions.items", [])} />
                )}
              </Grid>
            </Grid>
          ))}
      </Container>
    </section>
  );
}

export default FeaturesSection;
