import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { HelmetProvider } from 'react-helmet-async';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';


const GQL_ENDPOINT = process.env.REACT_APP_KONTENT_GRAPHQL_ENDPOINT || "https://graphql.kontent.ai";
const PROJECT_ID = process.env.REACT_APP_KONTENT_PROJECT_ID || "ad25961e-f934-01dc-e1fa-f4dd41b84df2";


const client = new ApolloClient({
    cache: new InMemoryCache({
        addTypename: false
        // // https://github.com/apollographql/apollo-client/issues/7648#issuecomment-968969367
        // possibleTypes: {
        //     _Item: [
        //         "LandingPage",
        //         "ListingPage",
        //         "SimplePage"
        //     ]
        // }
    }),
    uri: `${GQL_ENDPOINT}/${PROJECT_ID}`,
});

ReactDOM.render(
    <React.StrictMode>
        <HelmetProvider>
            <ApolloProvider client={client}>
                <App />
            </ApolloProvider>
        </HelmetProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
