import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import  SecureLS  from 'secure-ls';

const ls = new SecureLS({ encodingType: 'aes' });

const token = ls.get('authToken');

const httpLink = createHttpLink({
  uri: 'https://your-backend-url/graphql', 
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const Client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default Client;
