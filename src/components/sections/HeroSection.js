import { Container, Grid, makeStyles, Typography, useTheme } from "@material-ui/core";
import get from "lodash.get";
import React from "react";
import { CtaButtons, Image, RichText } from "..";


const useStyles = makeStyles((theme) => ({
  section: {
    background: `linear-gradient(to right,${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    padding: theme.spacing(2),
    color: theme.palette.primary.contrastText
  },
  column: {
    margin: "auto",
    color: theme.palette.primary.contrastText,
    background: "transparent",
  },
  content: {
    marginTop: theme.spacing(2),
  },
  actions: {
    paddingTop: theme.spacing(2),
    color: theme.palette.primary.contrastText
  }
}));

function HeroSection(props) {
  const classes = useStyles();
  const section = get(props, "section", null);

  const theme = useTheme();
  const imageSizes = `(min-width: ${theme.breakpoints.values.sm}px) 40vw, 100vw`;

  return (
    <section id={get(section, "_system.codename", null)} className={classes.section}>
      <Container>
        <Grid container spacing={2} alignItems="stretch" direction="row-reverse">

          {get(section, "image[0]", null) && (
            <Grid item xs={12} sm={6} className={classes.column}>
              <Image
                sizes={imageSizes}
                asset={get(section, "image[0]", null)}
                alt={get(section, "image[0].description") || get(section, "image[0].name")}
                loading="eager" />
            </Grid>
          )}

          <Grid item xs={12} sm={4} className={classes.column}>
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
    </section >
  );
}

export default HeroSection;
