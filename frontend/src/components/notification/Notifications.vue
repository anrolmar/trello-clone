<script setup lang="ts">
import { useNotificationsStore } from "@/stores";
import { NotificationGroup as KNotificationGroup } from "@progress/kendo-vue-notification";

const storeNotifications = useNotificationsStore();
</script>

<template>
  <KNotificationGroup
    class="notifications"
    :style="{
      right: 0,
      bottom: 0,
      alignItems: 'flex-start',
      flexWrap: 'wrap-reverse',
    }"
    v-if="storeNotifications.items.length > 0"
  >
    <Alert
      v-for="notification in storeNotifications.items"
      :key="notification.id"
      :notification="notification"
    />
  </KNotificationGroup>
</template>

<style scoped>
.notifications {
  @apply m-1.5 items-end flex-wrap-reverse;
}
</style>
