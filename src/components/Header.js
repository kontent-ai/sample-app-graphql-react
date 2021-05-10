import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import get from "lodash.get";
import { Action, Image, Link, SideDrawer } from ".";
import { Container, Hidden } from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  logo: {
    width: "200px",
  },
  mainMenu: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "flex-end",
    "& a": {
      margin: theme.spacing(1),
    }
  }
}));

function Header(props) {
  const classes = useStyles();
  const asset = get(props, "item.header_logo.value[0]");
  const title = get(props, "item.title.value", null);
  const mainMenuActions = get(props, "item.main_menu.value[0].actions.value", []);

  return (
    <div className={classes.root}>
      <AppBar color="transparent" position="sticky">
        <Container>
          <Toolbar>
            <Link href='/' className={classes.logo}>
              {asset
                ? <Image
                   asset={asset}
                   src={asset.url}
                   alt={title}
                   width="200"
                   height="60"
                  />
                : <Typography variant="h6">{title}</Typography>
              }
            </Link>
            <Hidden smDown>
              <div className={classes.mainMenu}>
                {mainMenuActions.map((navigationItem, index) =>
                    <Action key={index} action={navigationItem} {...props} />)}
              </div>
            </Hidden>
            <Hidden mdUp>
              <div className={classes.mainMenu}>
                <SideDrawer navLinks={mainMenuActions} {...props} />
              </div>
            </Hidden>
          </Toolbar>
        </Container>
      </AppBar>
    </div >
  );
}

export default Header;
