import { useState, useEffect } from "react";
import { Box, makeStyles } from "@material-ui/core";
import upperFirst from "lodash.upperfirst";
import camelCase from "lodash.camelcase";
import sections from "./components/sections";
import { fetchKontentItem } from "./KontentDeliveryClient";
import { Layout, UnknownComponent } from './components';
import get from 'lodash.get';

const useStyles = makeStyles((theme) => ({
  sections: {
    "& > section:first-child": {
      paddingTop: theme.spacing(8),
      paddingBottom: theme.spacing(8)
    }
  }
}));

function Home(props) {
  const [item, setItem] = useState(null);
  const classes = useStyles();

  useEffect( () => {
    async function fetchDeliverData() {
      const item = await fetchKontentItem(props.itemCodename, 3);

      setItem(item);
    }

    fetchDeliverData();
  }, [props.itemCodename]);

  if (!item) {
    return "loading...";
  }

  return (
    <Layout item={item}>
      <Box className={classes.sections}>
        {get(item, "content.value[0].sections.value", []).map((section, index) => {
          const contentType = upperFirst(camelCase(get(section, "system.type", null)));
          const Component = sections[contentType];

          if (process.env.NODE_ENV === "development" && !Component) {
            console.error(`Unknown section component for section content type: ${contentType}`);
            return (
                <UnknownComponent key={index} {...props}>
                  <pre>{JSON.stringify(section, undefined, 2)}</pre>
                </UnknownComponent>
            );
          }

          return (
              <Component key={index} {...props} section={section} site={props} />
          );
        })
        }
      </Box>
    </Layout>
  )
}

export default Home
