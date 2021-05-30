import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { HelmetProvider } from 'react-helmet-async';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "http://localhost:5000/graphql/ce50141b-c42b-01d8-c0b6-349de8c50622"
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
