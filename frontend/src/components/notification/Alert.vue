<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  notification: Notification;
}>();

const storeNotifications = useNotificationsStore();
const show = ref<boolean>(true);

const onClose = () => {
  show.value = false;
  storeNotifications.remove(props.notification.id);
};
</script>

<script lang="ts">
import { useNotificationsStore } from "@/stores";
import { Fade as KFade } from "@progress/kendo-vue-animation";
import { Notification as KNotification } from "@progress/kendo-vue-notification";
import type { Notification } from "./types";

export default {
  name: "NotificationAlert",
};
</script>

<template>
  <KFade :appear="show">
    <KNotification
      :type="{ style: notification.style, icon: true }"
      :closable="true"
      @close="onClose"
    >
      <div v-if="notification.html" v-html="notification.message"></div>
      <span v-else>{{ notification.message }}</span>
    </KNotification>
  </KFade>
</template>

<style scoped></style>
