import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import App from './App';
import { HelmetProvider } from 'react-helmet-async';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { name, version } from "../package.json";

const GQL_ENDPOINT = process.env.REACT_APP_KONTENT_GRAPHQL_ENDPOINT || "https://graphql.kontent.ai";
const PROJECT_ID = process.env.REACT_APP_KONTENT_PROJECT_ID || "ad25961e-f934-01dc-e1fa-f4dd41b84df2";
const GA_TOKEN = process.env.REACT_APP_GA_ANALYTICS_TOKEN;

const client = new ApolloClient({
    cache: new InMemoryCache({
        // https://github.com/apollographql/apollo-client/issues/7648#issuecomment-968969367
        // possibleTypes: {
        //     _Item: [
        //         "LandingPage",
        //         "ListingPage",
        //         "SimplePage"
        //     ]
        // }
    }),
    uri: `${GQL_ENDPOINT}/${PROJECT_ID}`,
    headers: {
        'X-KC-SOURCE': `${name};${version}`
    }
});

GA_TOKEN && ReactGA.initialize(GA_TOKEN);

ReactDOM.render(
    <React.StrictMode>
        <HelmetProvider>
            <ApolloProvider client={client}>
                <App initializeAnalytics={!!GA_TOKEN}/>
            </ApolloProvider>
        </HelmetProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
