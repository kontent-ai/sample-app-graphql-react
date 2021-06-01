import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { fetchKontentItem, getSitemapMappings } from './KontentDeliveryClient';
import get from 'lodash.get';
import Post from './Post';
import { getUrlSlug } from './utils';
import LandingPage from './LandingPage';
import ListingPage from './ListingPage';
import SimplePage from './SimplePage';
import { UnknownComponent } from './components';

export default function App() {
  const [mappings, setMappings] = useState(null);
  const [siteConfiguration, setSiteConfiguration] = useState({
    asset: null,
    title: null,
    mainMenuActions: [],
    favicon: null,
    font: null,
    palette: null});

  useEffect( () => {
    async function fetchDeliverData() {
      const mappings = await getSitemapMappings();
      const homepage = await fetchKontentItem("homepage", 3);

      setSiteConfiguration({
        asset: get(homepage, "header_logo.value[0]", null),
        title: get(homepage, "title.value", ""),
        mainMenuActions: get(homepage, "main_menu.value[0].actions.value", []),
        favicon: get(homepage, "favicon.value[0].url", null),
        font: get(homepage, "font.value[0].codename", null),
        palette: get(homepage, "palette.value[0].codename", null)});
      setMappings(mappings);
    }

    fetchDeliverData();
  }, []);

  if(!mappings) {
    return "loading...";
  }

  return (
    <Router>
      <Switch>
        <Route path="/" render={renderPage}/>
      </Switch>
    </Router>
  );

  function renderPage({ location }){
    const navigationItem = mappings[getUrlSlug(location.pathname)];

    if(!navigationItem) {
      if (process.env.NODE_ENV === "development") {
        console.error(`Unknown navigation item pathname: ${location.pathname}`);
        return (
            <div>
              <h2>Not found</h2>
              <pre>{JSON.stringify(mappings, undefined, 2)}</pre>
            </div>
        );
      }
      return <h2>Not found</h2>;
    }

    const {
      codename,
      type
    } = navigationItem;

    switch (type) {
      case "landing_page":
        return <LandingPage codename={codename} siteConfiguration={siteConfiguration} mappings={mappings} /> ;
      case "listing_page":
        return <ListingPage codename={codename} siteConfiguration={siteConfiguration} mappings={mappings} />;
      case "simple_page":
        return <SimplePage codename={codename} siteConfiguration={siteConfiguration} mappings={mappings} />;
      case "post":
        return <Post codename={codename} siteConfiguration={siteConfiguration} mappings={mappings} />;
      default:
        if (process.env.NODE_ENV === "development") {
          console.error(`Unknown navigation item content type: ${type}`);
          return (
              <UnknownComponent>
                <pre>{JSON.stringify(mappings, undefined, 2)}</pre>
              </UnknownComponent>
          );
        }
        return null;
    }
  }
}


