import React from "react";
import get from "lodash.get";
import { Container, Grid, makeStyles, Typography, useTheme } from "@material-ui/core";
import { CtaButtons, Image, RichText } from "..";

const useStyles = makeStyles((theme) => ({
  section: {
    padding: theme.spacing(2)
  },
  column: {
    padding: theme.spacing(1)
  },
  actions: {
    "& a": {
      margin: theme.spacing(1)
    }
  }
}));

function ContentSection(props) {
  const section = get(props, "section", null);
  const classes = useStyles();

  const theme = useTheme();
  const imageSizes = `(min-width: ${theme.breakpoints.values.sm}px) 50vw, 100vw`;

  return (
    <section id={get(section, "system.codename", null)} className={classes.section}>
      <Container>
        <Grid container spacing={2} alignItems="stretch" direction="row-reverse">

          {get(section, "image[0]", null) && (
            <Grid item xs={12} sm={6} className={classes.column}>
              <Image
                sizes={imageSizes}
                asset={(get(section, "image[0]", null))}
                alt={get(section, "image[0].description") || get(section, "image[0].name")} />
            </Grid>
          )}

          <Grid item xs={12} sm={get(section, "image[0]", null) ? 6 : 12} className={classes.column}>
            {get(section, "title", null) && (
              <Typography variant="h2">{get(section, "title", null)}</Typography>
            )}

            <Typography variant="subtitle1" className={classes.content}>
              <RichText
                {...props}
                richTextElement={get(section, "content", null)}
              />
            </Typography>

            {get(section, "actions.items[0]", null) && (
              <div className={classes.actions}>
                <CtaButtons {...props} actions={get(section, "actions.items", [])} />
              </div>
            )}
          </Grid>

        </Grid>
      </Container>
    </section>
  );
}

export default ContentSection;
