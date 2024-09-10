import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getToken } from  '../helper/storage.js';

const httpLink = createHttpLink({
  uri: 'https://d146-113-199-229-115.ngrok-free.app//graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = getToken(); 
  console.log(token);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
