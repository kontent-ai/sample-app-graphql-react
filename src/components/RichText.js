import { makeStyles, Typography, useTheme } from "@material-ui/core";
import get from "lodash.get";
import { Image, Link } from ".";
import { getUrlFromMappingByCodename } from "../utils";
import { PortableText, } from '@portabletext/react';
import { browserParse, transformToPortableText, resolveTable } from '@pokornyd/kontent-ai-rich-text-parser';

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
  const mappings = get(props, "mappings");

  const classes = useStyles();
  const theme = useTheme();

  const portableTextComponents = {
    types: {
      // image: () => {

      // },
      component: (block) => {
        const linkedItem = richTextElement.components.items.find(item => item._system_.codename === block.value.component._ref);
        const contentItemType = linkedItem ? linkedItem._system_.type._system_.codename : '';

        switch (contentItemType) {
          case "quote":
            return (
              <blockquote className={classes.quote}>
                &ldquo;{linkedItem.quoteText}&rdquo;
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
            return <div>Content item not supported</div>;
        }
      },
      table: ({ value }) => {
        const table = (
          <table>
            {
              value.rows.map(row => (
                <tr>
                  {row.cells.map(cell => {
                    return (
                      <td>
                        <PortableText
                          value={cell.content}
                          components={portableTextComponents}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))
            }
          </table>
        );
        return table;
      }
    },
    marks: {
      link: ({ value, children }) => {
        const target = (value?.href || '').startsWith('http') ? '_blank' : undefined
        return (
          <a href={value?.href} target={target} rel={value?.rel} title={value?.title} data-new-window={value['data-new-window']}>
            {children}
          </a>
        )
      },
      internalLink: ({ value, children }) => {
        const link = richTextElement.itemHyperlinks.items.find(link => link?._system_.id == value.reference._ref);
        const url = getUrlFromMappingByCodename(mappings, link._system_.codename);
        if (url) {
          return (
            <Link href={url}>
              {children}
            </Link>
          );
        }
        else {
          return (
            <del>{children}</del>
          );
        }
      }
    }
  }

  const parsedTree = browserParse(richTextElement.html);
  const portableText = transformToPortableText(parsedTree);

  return (
    <PortableText
      className={classes.richText}
      value={portableText}
      components={portableTextComponents} />


    // <RichTextComponent
    //   className={classes.richText}
    //   richTextElement={richTextElement}
    //   mappings={mappings}
    //   // TODO adjust naming and detection linked item vs. component - internal link https://kontent-ai.atlassian.net/browse/DEL-3081
    //   resolveLinkedItem={(linkedItem, domNode, domToReact) => {
    //     switch (linkedItem?._system_.type._system_.codename) {
    //       case "quote":
    //         return (
    //           <blockquote className={classes.quote}>
    //             &ldquo;{linkedItem.quoteText}&rdquo;
    //           </blockquote>
    //         );
    //       case "code_block":
    //         return (
    //           <Typography component="div" className={classes.code}>
    //             <RichText
    //               {...props}
    //               richTextElement={get(linkedItem, "code", null)}
    //             />
    //           </Typography>
    //         );
    //       default:
    //         return domToReact([domNode]);
    //     }
    //   }}
    //   resolveImage={(image, _domNode, _domToReact) => {
    //     return (
    //       <div className={classes.inlineImage}>
    //         <Image
    //           sizes={`${theme.breakpoints.values.sm}px`}
    //           asset={image}
    //           width={theme.breakpoints.values.sm}
    //           alt={image.description || image.name} />
    //       </div>
    //     );
    //   }}
    //   resolveLink={(link, mappings, domNode, domToReact) => {
    //     const url = getUrlFromMappingByCodename(mappings, link._system_.codename);
    //     if (url) {
    //       return (
    //         <Link href={url}>
    //           {domNode.children[0].data}
    //         </Link>
    //       );
    //     }
    //     else {
    //       return (
    //         <del>{domToReact([domNode])}</del>
    //       );
    //     }
    //   }}
    //   resolveDomNode={(domNode, _domToReact) => {
    //     return domNode;
    //   }}
    // />
  );
}

export default RichText;
