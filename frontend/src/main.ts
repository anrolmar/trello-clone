import "@/assets/base.css";
import "@progress/kendo-theme-default/dist/all.css";
import "@twicpics/components/style.css";

import { createApp, h, provide } from "vue";

import App from "./App.vue";
import { DefaultApolloClient } from "@vue/apollo-composable";
import TwicPics from "@twicpics/components/vue3";
import apolloClient from "./graphql/ApolloClient";
import { createPinia } from "pinia";
import router from "./router";

const pinia = createPinia();
const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },
  render: () => h(App),
});

app
  .use(pinia)
  .use(router)
  .use(TwicPics, {
    domain: `${import.meta.env.VITE_TWICPICS_URL}`,
  });

app.mount("#app");
