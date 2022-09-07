import { useRoute, useRouter } from "vue-router";

import { computed } from "vue";
import { useLocalStorage } from "@vueuse/core";

const useMenus = (): any => {
  const router = useRouter();
  const route = useRoute();

  const expanded = useLocalStorage("settings-drawer-expanded", true);

  const expandedIcon = computed(() =>
    expanded.value ? "k-i-arrow-chevron-left" : "k-i-arrow-chevron-right"
  );

  const items = computed(() =>
    [
      {
        text: "Boards",
        icon: "k-i-set-column-position",
        data: {
          path: "/boards",
        },
      },
      {
        text: "Templates",
        icon: "k-i-border-left",
        data: {
          path: "/templates",
        },
      },
      {
        text: "Settings",
        icon: "k-i-gear",
        data: {
          path: "/settings",
        },
      },
      {
        text: "Collapse",
        icon: expandedIcon.value,
        data: {
          action: () => (expanded.value = !expanded.value),
        },
      },
    ].map((item) => ({
      ...item,
      selected: item.data.path ? route.path.startsWith(item.data.path) : false,
    }))
  );

  return {
    expanded,
    items,

    onSelect: ({ itemIndex }: { itemIndex: number }) => {
      const item = items.value[itemIndex];
      if (!item) return;
      if (item.data.path) router.push(item.data.path);
      if (typeof item.data.action === "function") item.data.action();
    },
  };
};

export default useMenus;
