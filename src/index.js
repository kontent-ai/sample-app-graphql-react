import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { HelmetProvider } from 'react-helmet-async';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: process.env.REACT_APP_GRAPHQL_API_ENDPOINT
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
