import { makeStyles, Typography, useTheme } from "@material-ui/core";
import get from "lodash.get";
import { Image, Link } from ".";
import { getUrlFromMapping } from "../utils";
import RichTextComponent from "./RichTextComponent";

const useStyles = makeStyles((theme) => ({
  richText: {
    "& table": {
      borderCollapse: "collapse",
      "& td,th": {
        border: "1px solid",
        borderColor: theme.palette.grey[500],
        textAlign: "center",
        padding: theme.spacing(1),
      },
      "& tr:nth-child(even)": {
        backgroundColor: theme.palette.grey[100],
      }
    }
  },
  quote: {
    fontStyle: "italic",
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.grey[100],
    display: "inline-block"
  },
  code: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[100],
    minWidth: "50vw",
    display: "inline-block"
  },
  inlineImage: {
    width: "theme.breakpoints.values.sm"
  },
}));

function RichText(props) {
  const richTextElement = get(props, "richTextElement", "");
  const linkedItems = get(props, "pageObject.linkedItems", []);
  const mappings = get(props, "mappings");

  const classes = useStyles();
  const theme = useTheme();

  return (
    <RichTextComponent
      className={classes.richText}
      richTextElement={richTextElement}
      linkedItems={linkedItems}
      mappings={mappings}
      resolveLinkedItem={(linkedItem, domNode, domToReact) => {
        switch (linkedItem.system.type) {
          case "quote":
            return (
              <blockquote className={classes.quote}>
                &ldquo;{linkedItem.quote_text.value}&rdquo;
              </blockquote>
            );
          case "code_block":
            return (
              <Typography component="div" className={classes.code}>
                <RichText
                  {...props}
                  richTextElement={get(linkedItem, "code", null)}
                />
              </Typography>
            );
          default:
            return domToReact([domNode]);
        }
      }}
      resolveImage={(image, _domNode, _domToReact) => {
        return (
          <div className={classes.inlineImage}>
            <Image
              sizes={`${theme.breakpoints.values.sm}px`}
              asset={image}
              width={theme.breakpoints.values.sm}
              alt={image.description || image.name} />
          </div>
        );
      }}
      resolveLink={(link, mappings, domNode, domToReact) => {
        const url = getUrlFromMapping(mappings, link.codename);
        if (url) {
          return (
            <Link href={url}>
              {domNode.children[0].data}
            </Link>
          );
        }
        else {
          return (
            <del>{domToReact([domNode])}</del>
          );
        }
      }}
      resolveDomNode={(domNode, _domToReact) => {
        return domNode;
      }}
    />
  );
}

export default RichText;
