import { Box, makeStyles } from "@material-ui/core";
import { Header } from ".";
import get from 'lodash.get';
import { Helmet } from 'react-helmet-async';
import React from 'react';
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

const useStyles = makeStyles((_theme) => ({
    root: {
        minHeight: "100vh"
    },
    flex: {
        flexGrow: 1
    }
}));

function Layout(props) {
    const classes = useStyles();
    const favicon = get(props, "item.favicon.value[0].url", null);
    const description = get(props, "seo.description", null); // pageProps
    const keyWords = get(props, "seo.keywords", null); // pageProps
    const canonicalUrl = get(props, "seo.canonicalUrl", null); // pageProps
    const noIndex = get(props, "seo.noIndex", null); // pageProps
    const font = get(props, "item.font.value[0].codename", null);
    const fontName = font === "nunito_sans"
                     ? "Nunito Sans"
                     : font === "fira_sans"
                       ? "Fira Sans"
                       : "Arial";

    let title = get(props, "item.title.value", "");
    if (title) {
        title += " | ";
    }
    title += get(props, "seo.title", null); //pageprops

    const palette = (get(props, "item.palette.value[0].codename", null));
    const colors = {
        primary: "#F05A22",
        secondary: "#B72929"
    };

    switch (palette) {
        case "blue":
            colors.primary = "#3553B8";
            colors.secondary = "#81D4FA";
            break;
        case "cyan":
            colors.primary = "#007C91";
            colors.secondary = "#5DDEF4";
            break;
        case "green":
            colors.primary = "#2C9E7E";
            colors.secondary = "#4b830d";
            break;
        case "purple":
            colors.primary = "#7D3F9C";
            colors.secondary = "#7986cb";
            break;
        case "default":
        default:
            break;
    }

    const theme = createMuiTheme({
        palette: {
            primary: {
                main: colors.primary,
            },
            secondary: {
                main: colors.secondary,
            },
            background: {
                default: "#FFF",
            },
        },
        typography: {
            fontFamily: [
                fontName,
                "sans-serif"
            ]
        },
    });


  return (
      <>
          <Helmet>
              <title>{title}</title>
              <meta charSet="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <meta name="google" content="notranslate" />

              {favicon && (
                  <link rel="icon" href={favicon} />
              )}

              <meta name="description" content={description} />
              {keyWords && (
                  <meta name="keywords" content={keyWords} />
              )}
              {canonicalUrl ?? (
                  <link rel="canonical" href={canonicalUrl} />
              )}
              {noIndex && (
                  <meta name="robots" content="noindex,follow" />
              )}

              {(font !== "system-sans") && (
                  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
              )}
              {(font === "nunito_sans") ? ([
                  <link key="0" href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" as="style" rel="preload" />,
                  <link key="1" href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" media="print" onLoad="this.media='all'" />,
                  <noscript key="2">{`
                      <link
                          rel="stylesheet"
                          href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
                      />
                  `}</noscript>
              ]) : ((font === "fira_sans") && ([
                  <link key="0" href="https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,400;0,600;1,400;1,600&display=swap" as="style" rel="preload" />,
                  <link key="1" href="https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,400;0,600;1,400;1,600&display=swap" rel="stylesheet" media="print" onLoad="this.media='all'" />,
                  <noscript key="2">{`
                      <link
                          rel="stylesheet"
                          href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
                      />
                  `}</noscript>
              ]))}
          </Helmet>
          <ThemeProvider theme={theme}>
              <CssBaseline />
              <Box display="flex" flexDirection="column" alignItems="stretch" alignContent="space-between" className={classes.root}>
                  <Header {...props} />
                  <main className={classes.flex}>
                      {props.children}
                  </main>
              </Box>
          </ThemeProvider>
      </>
  );
}

export default Layout;
