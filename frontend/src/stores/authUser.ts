import type { User } from "@/types";
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
      authClient.signOut();
    },
  },
  getters: {},
});

export default useAuthUserStore;
