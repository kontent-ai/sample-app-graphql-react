import React, { useState } from "react";
import get from "lodash.get";
import {
  Container,
  Grid,
  makeStyles,
  Typography,
  useTheme,
} from "@material-ui/core";
import {
  actionFields,
  assetFields,
  richTextFields,
} from "../../graphQLFragments";
import { CtaButtons, GraphQLLoader, Image, RichText } from "..";
import { gql, useQuery } from "@apollo/client";

const useStyles = makeStyles((theme) => ({
  section: {
    padding: theme.spacing(2),
  },
  column: {
    padding: theme.spacing(1),
  },
  actions: {
    "& a": {
      margin: theme.spacing(1),
    },
  },
}));

function ContentSection(props) {
  const query = gql`
    query ContentSectionQuery($codename: String!, $languageCodename: String!) {
      contentSection(
        codename: $codename
        languageFilter: { languageCodename: $languageCodename }
      ) {
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

    ${richTextFields}
    ${assetFields}
    ${actionFields}
  `;

  const classes = useStyles();

  const theme = useTheme();
  const imageSizes = `(min-width: ${theme.breakpoints.values.sm}px) 50vw, 100vw`;

  const [section, setSection] = useState(null);
  const { loading, error } = useQuery(
    query,
    {
      variables: {
        codename: props.section._system_.codename,
        languageCodename: props.section._system_.language._system_.codename,
      },
      onCompleted: (data) => {
        setSection(data.heroSection);
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
        <Grid
          container
          spacing={2}
          alignItems="stretch"
          direction="row-reverse"
        >
          {get(section, "image", null) && (
            <Grid item xs={12} sm={6} className={classes.column}>
              <Image
                sizes={imageSizes}
                asset={get(section, "image", null)}
                alt={
                  get(section, "image.description") ||
                  get(section, "image.name")
                }
              />
            </Grid>
          )}

          <Grid
            item
            xs={12}
            sm={get(section, "title", null) ? 6 : 12}
            className={classes.column}
          >
            {get(section, "title", null) && (
              <Typography variant="h2">
                {get(section, "title", null)}
              </Typography>
            )}

            <Typography variant="subtitle1" className={classes.content}>
              <RichText
                {...props}
                richTextElement={get(section, "content", null)}
              />
            </Typography>

            {get(section, "actions.items[0]", null) && (
              <div className={classes.actions}>
                <CtaButtons
                  {...props}
                  actions={get(section, "actions.items", [])}
                />
              </div>
            )}
          </Grid>
        </Grid>
      </Container>
    </section>
  );
}

export default ContentSection;
