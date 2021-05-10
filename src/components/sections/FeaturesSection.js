import React from "react";
import get from "lodash.get";
import { Container, Grid, makeStyles, Typography, useTheme } from "@material-ui/core";
import { CtaButtons, Image, RichText } from "..";

const useStyles = makeStyles((theme) => ({
  section: {
    padding: theme.spacing(8)
  },
  row: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  image: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  intro: {
    textAlign: "center"
  },
  alignRight: {
    textAlign: "right"
  }
}));

function FeaturesSection(props) {
  const section = get(props, "section", null);
  const classes = useStyles();

  const theme = useTheme();
  const imageSizes = `(min-width: ${theme.breakpoints.values.sm}px) 40vw, 100vw`;

  return (
    <section id={get(section, "system.codename", null)} className={classes.section}>
      <Container>
        <div className={classes.intro}>
          {get(section, "title.value", null) && (
            <Typography variant="h2">{get(section, "title.value", null)}</Typography>
          )}

          {get(section, "subtitle.value", null) && (
            <Typography variant="subtitle1">
              <RichText
                {...props}
                richTextElement={get(section, "subtitle", null)}
              />
            </Typography>)}
        </div>

        {get(section, "features.value[0]", null) && (
          get(section, "features.value", []).map((feature, index) => (
            <Grid container spacing={2} alignItems="center" key={index} direction={index % 2 ? "row-reverse" : "row"} className={classes.row}>
              {get(feature, "image.value[0]", null) && (
                <Grid item xs={12} sm={6} className={`${classes.column}, ${classes.image}`}>
                  <Image
                    sizes={imageSizes}
                    asset={(get(feature, "image.value[0]", null))}
                    alt={get(feature, "image.value[0].description") || get(feature, "image.value[0].name")} />
                </Grid>
              )}

              <Grid item xs={12} sm={4} className={`${classes.column} ${index % 2 ? classes.alignRight : undefined}`}>
                <Typography variant="h3">{get(feature, "title.value", null)}</Typography>

                <RichText
                  component="div"
                  {...props}
                  richTextElement={get(feature, "content", null)}
                />

                {
                  get(feature, "actions.value[0]", null) && (
                    <CtaButtons {...props} actions={get(feature, "actions.value", null)} />
                  )
                }
              </Grid>
            </Grid>)
          )
        )}
      </Container>
    </section>
  );
}

export default FeaturesSection;
