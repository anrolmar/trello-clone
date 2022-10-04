import GET_CURRENT_USER from "@/graphql/queries/auth/currentUser.query.gql";
import USER_SIGN_UP from "@/graphql/mutations/users/userSignUp.mutation.gql";
import type { User } from "@/types";
import apolloClient from "@/graphql/ApolloClient";
import { authClient } from "@/authentication/8baseAuth";
import { defineStore } from "pinia";

interface AuthUserState {
  authenticated: boolean;
  tokenId: string | null;
  user: User | null;
}

const localStorageKey = "id_token";
const tokenId = localStorage.getItem(localStorageKey);

const useAuthUserStore = defineStore("authUser", {
  state: (): AuthUserState => ({
    authenticated: !!tokenId,
    tokenId,
    user: null as User | null,
  }),
  actions: {
    login() {
      authClient.authorize();
    },
    logout() {
      authClient.logout();
      this.authenticated = false;
      this.tokenId = null;
      localStorage.removeItem(localStorageKey);
    },
    async initUser() {
      if (!this.tokenId) return;
      try {
        const {
          data: { user },
        } = await fetchUser(this.tokenId);
        this.user = user;
      } catch (error) {
        console.error("No existing user matching with the token id");
      }
    },
    async handleAuthentication() {
      const { idToken, email, firstName } =
        await authClient.getAuthorizedData();
      try {
        await fetchUser(idToken);
      } catch {
        await apolloClient.mutate({
          mutation: USER_SIGN_UP,
          variables: {
            user: {
              email,
              team: {
                create: {
                  name: `${firstName}'s team`,
                },
              },
            },
            authProfileId: import.meta.env.VITE_AUTH_PROFILE_ID,
          },
          context: {
            headers: {
              authorization: `Bearer ${idToken}`,
            },
          },
        });
      }

      this.authenticated = true;
      this.tokenId = idToken;
      localStorage.setItem(localStorageKey, idToken);
    },
  },
  getters: {},
});

const fetchUser = async (tokenId: string) => {
  const context = {
    headers: {
      authorization: `Bearer ${tokenId}`,
    },
  };

  return apolloClient.query({
    query: GET_CURRENT_USER,
    context,
  });
};

export default useAuthUserStore;
