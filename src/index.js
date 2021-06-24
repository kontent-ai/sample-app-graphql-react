import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { HelmetProvider } from 'react-helmet-async';
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';


const GQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_API_ENDPOINT || "https://graphql.kontent.ai";
const PROJECT_ID = process.env.REACT_APP_KONTENT_PROJECT_ID || "ad25961e-f934-01dc-e1fa-f4dd41b84df2";
const PREVIEW_API_KEY = process.env.REACT_APP_KONTENT_PREVIEW_API_KEY;


const httpLink = createHttpLink({
    uri: `${GQL_ENDPOINT}/${PROJECT_ID}`
});

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('token');
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: PREVIEW_API_KEY ? `Bearer ${PREVIEW_API_KEY}` : "",
        }
    }
});


const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: authLink.concat(httpLink),
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
