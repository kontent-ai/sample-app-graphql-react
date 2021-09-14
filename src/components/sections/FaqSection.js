import React from "react";
import get from "lodash.get";
import { Accordion, AccordionDetails, AccordionSummary, Container, makeStyles, Typography } from "@material-ui/core";
import { RichText } from "..";

const useStyles = makeStyles((theme) => ({
  section: {
    padding: theme.spacing(2),
  },
  intro: {
    textAlign: "center"
  },
  accordion: {
    marginTop: theme.spacing(1)
  }
}));

function FaqSection(props) {
  const section = get(props, "section", null);
  const classes = useStyles();


  return (
    <section id={get(section, "_system.codename", null)} className={classes.section}>
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
            </Typography>)}
        </div>

        {get(section, "faqItems.items", []).map((faqItem, faqItem_idx) => (
          <Accordion key={faqItem_idx} className={classes.accordion}>
            <AccordionSummary
              aria-controls={`panel${faqItem_idx + 1}a-content`}
              id={`panel${faqItem_idx + 1}a--header`}
            >
              <Typography variant="h6">{get(faqItem, "question", null)}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography component="div">

                <RichText
                  {...props}
                  richTextElement={get(faqItem, "answer", null)}
                />
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </section>
  );
}

export default FaqSection;
