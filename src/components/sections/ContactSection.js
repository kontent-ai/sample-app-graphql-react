import React, { useState } from "react";
import {
  richTextFields,
} from "../../graphQLFragments";
import get from "lodash.get";
import { Button, Container, makeStyles, Typography } from "@material-ui/core";
import { FormField, GraphQLLoader, RichText } from "..";
import { gql, useQuery } from "@apollo/client";

const useStyles = makeStyles((theme) => ({
  formSubmission: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(1),
  },
}));

function ContactSection(props) {
  const query = gql`
    query ContactSectionQuery($codename: String!, $languageCodename: String!) {
      contactSection(
        codename: $codename
        languageFilter: { languageCodename: $languageCodename }
      ) {
        title
        subtitle {
          ...RichTextFields
        }
        content {
          ...RichTextFields
        }
        form {
          ... on Form {
            formId
            formAction
            submitLabel
            fields {
              items {
                ... on BaseFormField {
                  _system_ {
                    type {
                      _system_ {
                        codename
                      }
                    }
                  }
                  type {
                    items {
                      _system_ {
                        codename
                      }
                    }
                  }
                  name
                  label
                  defaultValue
                  configuration {
                    items {
                      _system_ {
                        codename
                      }
                    }
                  }
                }
                ... on SelectFormField {
                  _system_ {
                    type {
                      _system_ {
                        codename
                      }
                    }
                  }
                  label
                  options {
                    items {
                      ... on SelectFormFieldOption {
                        label
                        value
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    ${richTextFields}
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
        setSection(data.contactSection);
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

        <Typography component="div">
          <RichText
            {...props}
            richTextElement={get(section, "content", null)}
          />
        </Typography>

        {section.form && (
          <form
            name={get(section.form, "formId", null)}
            id={get(section.form, "formId", null)}
            action={get(section.form, "formAction", null)}
            method="POST"
          >
            {get(section.form, "fields.items", []).map((field, field_idx) => (
              <FormField field={field} key={field_idx} />
            ))}

            <Button
              variant="contained"
              color="primary"
              className={classes.formSubmission}
            >
              {get(section.form, "submitLabel", null)}
            </Button>
          </form>
        )}
      </Container>
    </section>
  );
}

export default ContactSection;
