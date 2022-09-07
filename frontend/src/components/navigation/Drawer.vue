<script setup lang="ts">
import { useMenus } from "@/composables";
import {
  Drawer as KDrawer,
  DrawerContent as KDrawerContent,
} from "@progress/kendo-vue-layout";

const { expanded, items, onSelect } = useMenus();
</script>

<script lang="ts">
export default {
  name: "DrawerNavigator",
};
</script>

<template>
  <KDrawer
    class="h-[90vh]"
    :expanded="expanded"
    :position="'start'"
    :mode="'push'"
    :mini="true"
    :items="items"
    @select="onSelect"
  >
    <KDrawerContent class="max-w-full overflow-hidden">
      <div class="p-5">
        <RouterView />
      </div>
    </KDrawerContent>
  </KDrawer>
</template>
