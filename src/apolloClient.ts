import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';

const GRAPHQL_ENDPOINT = 'https://graphql-pokeapi.graphcdn.app/';

export const apolloClient = new ApolloClient({
  link: from([
    new HttpLink({ uri: GRAPHQL_ENDPOINT, fetch })
  ]),
  cache: new InMemoryCache(),
});