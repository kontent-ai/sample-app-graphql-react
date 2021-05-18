import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { fetchKontentItem, fetchNavigationData, getSitemapMappings } from './KontentDeliveryClient';
import get from 'lodash.get';
import Post from './Post';
import Page from './components/Page';

export default function App() {
  const [mappings, setMappings] = useState(null);
  const [homepageData, setHomepageData] = useState(null);
  const [navigationData, setNavigationData] = useState({});
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
      const navigationData = await fetchNavigationData();
      const homepage = await fetchKontentItem("homepage", 3);

      setSiteConfiguration({
        asset: get(homepage, "header_logo.value[0]", null),
        title: get(homepage, "title.value", ""),
        mainMenuActions: get(homepage, "main_menu.value[0].actions.value", []),
        favicon: get(homepage, "favicon.value[0].url", null),
        font: get(homepage, "font.value[0].codename", null),
        palette: get(homepage, "palette.value[0].codename", null)});
      setNavigationData(navigationData);
      setHomepageData(homepage);
      setMappings(mappings);
    }

    fetchDeliverData();
  }, []);

  return (
    <Router basename="/">
      <Switch>
        <Route exact path="/">
          <Page item={homepageData} siteConfiguration={siteConfiguration} mappings={mappings} />
        </Route>
        <Route path="/blog/:slug" render={({match}) => <Post slug={match.params.slug} siteConfiguration={siteConfiguration} mappings={mappings} />}/>
        <Route path="/:slug" render={({match}) => <Page item={navigationData[match.params.slug]} siteConfiguration={siteConfiguration} mappings={mappings} />}/>
      </Switch>
    </Router>
  );


}
