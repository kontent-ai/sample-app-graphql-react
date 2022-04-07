import React, { useState } from "react";
import {
  actionFields,
  richTextFields,
} from "../../graphQLFragments";
import get from "lodash.get";
import { Container, Grid, makeStyles, Typography } from "@material-ui/core";
import { Action, GraphQLLoader, RichText } from "..";
import { gql, useQuery } from "@apollo/client";

const useStyles = makeStyles((theme) => ({
  section: {
    background: `linear-gradient(to right,${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    padding: theme.spacing(2),
    color: theme.palette.primary.contrastText,
  },
}));

function CtaSection(props) {
  const query = gql`
    query CtaSectionQuery($codename: String!, $languageCodename: String!) {
      ctaSection(
        codename: $codename
        languageFilter: { languageCodename: $languageCodename }
      ) {
        title
        subtitle {
          ...RichTextFields
        }
        action {
          ...ActionFields
        }
      }
    }

    ${richTextFields}
    ${actionFields}
  `;

  const classes = useStyles();

  const [section, setSection] = useState(null);

  const { loading, error } = useQuery(
    query,
    {
      variables: {
        codename: props.section._system_.codename,
        languageCodename: props.section._system_.language._system_.codename,
      },
      onCompleted: (data) => {
        setSection(data.ctaSection);
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
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <div className={classes.intro}>
              {get(section, "title", null) && (
                <Typography variant="h2">
                  {get(section, "title", null)}
                </Typography>
              )}
              {get(section, "subtitle", null) && (
                <Typography variant="subtitle1" className={classes.content}>
                  <RichText
                    {...props}
                    richTextElement={get(section, "subtitle", null)}
                  />
                </Typography>
              )}
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Action {...props} action={get(section, "action")} />
          </Grid>
        </Grid>
      </Container>
    </section>
  );
}

export default CtaSection;
