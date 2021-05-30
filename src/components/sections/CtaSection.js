import React from "react";
import get from "lodash.get";
import { Container, Grid, makeStyles, Typography } from "@material-ui/core";
import { Action, RichText } from "..";

const useStyles = makeStyles((theme) => ({
  section: {
    background: `linear-gradient(to right,${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    padding: theme.spacing(2),
    color: theme.palette.primary.contrastText
  }
}));

function CtaSection(props) {
  const section = get(props, "section", null);
  const classes = useStyles();


  return (
    <section id={get(section, "system.codename", null)} className={classes.section}>
      <Container>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <div className={classes.intro}>
              {get(section, "title", null) && (
                <Typography variant="h2">{get(section, "title", null)}</Typography>
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
            <Action {...props} action={get(section, "action.items[0]")} />
          </Grid>
        </Grid>


      </Container>
    </section>
  );
}

export default CtaSection;
