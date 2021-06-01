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
  const form = get(props, "section.form.value[0]", null);
  const classes = useStyles();

  return (
    <section id={get(section, "system.codename", null)} className={classes.section}>
      <Container>
        <div className={classes.intro}>
          {get(section, "title.value", null) && (
            <Typography variant="h2">{get(section, "title.value", null)}</Typography>
          )}
          {get(section, "subtitle.value", null) && (
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
            name={get(form, "form_id.value", null)}
            id={get(form, "form_id.value", null)}
            action={get(form, "form_id.form_action.value", null)}
            method="POST"
          >
            {get(form, "fields.value", []).map((field, field_idx) => (
              <FormField field={field} key={field_idx} />
            ))
            }

            <Button variant="contained" color="primary" className={classes.formSubmission}>
              {get(form, "submit_label.value", null)}
            </Button>
          </form>
        )}

      </Container>
    </section>
  );
}

export default ContactSection;
