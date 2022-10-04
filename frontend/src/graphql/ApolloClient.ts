import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client/core";

import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { useAuthUserStore } from "@/stores";

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: "https://api.8base.com/cl6dfqj9k00a409mhf8c29pjr",
});

const setAuthorizationLink = setContext((request, previousContext) => {
  const store = useAuthUserStore();
  return store.authenticated
    ? {
        ...previousContext,
        headers: {
          authorization: `Bearer ${store.tokenId}`,
        },
      }
    : previousContext;
});

// Error handling
const setErrorHandler = onError((error) => {
  const badToken = !!error.response?.errors?.find(
    (e: { code: string }) =>
      e.code === "TokenExpiredError" || e.code === "InvalidTokenError"
  );
  if (badToken) {
    const store = useAuthUserStore();
    store.login();
  }
});

// Cache implementation
const cache = new InMemoryCache();

// Create the apollo client
const apolloClient = new ApolloClient({
  link: setAuthorizationLink.concat(setErrorHandler).concat(httpLink),
  cache,
});

export default apolloClient;
