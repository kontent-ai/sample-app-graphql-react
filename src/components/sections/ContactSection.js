import React from "react";
import get from "lodash.get";
import { Button, Container, makeStyles, Typography } from "@material-ui/core";
import { FormField, RichText } from "..";

const useStyles = makeStyles((theme) => ({
  formSubmission: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(1)
  }
}));

function ContactSection(props) {
  const section = get(props, "section", null);
  const form = get(props, "section.form.items[0]", null);
  const classes = useStyles();

  return (
    <section id={get(section, "system.codename", null)} className={classes.section}>
      <Container>
        <div className={classes.intro}>
          {get(section, "title", null) && (
            <Typography variant="h2">{get(section, "title", null)}</Typography>
          )}
          {get(section, "subtitle", null) && (
            <Typography variant="subtitle1" >
              <RichText
                {...props}
                richTextElement={get(section, "subtitle", null)}
              />
            </Typography>
          )}
        </div>

        <Typography component="div">
          <RichText
            {...props}
            richTextElement={get(section, "content", null)}
          />
        </Typography>

        {form && (
          <form
            name={get(form, "formId", null)}
            id={get(form, "formId", null)}
            action={get(form, "formAction", null)}
            method="POST"
          >
            {get(form, "fields.items", []).map((field, field_idx) => (
              <FormField field={field} key={field_idx} />
            ))
            }

            <Button variant="contained" color="primary" className={classes.formSubmission}>
              {get(form, "submitLabel", null)}
            </Button>
          </form>
        )}

      </Container>
    </section>
  );
}

export default ContactSection;
