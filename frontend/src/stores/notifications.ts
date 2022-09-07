import type {
  Notification,
  NotificationOptions,
  NotificationStyle,
} from "@/components/notification/types";

import { defineStore } from "pinia";
import { v4 as uuid } from "uuid";

const defaultOptions: Required<NotificationOptions> = {
  closable: true,
  html: false,
  timeout: 3000,
  style: "info",
};

interface NotificationState {
  items: Array<Notification>;
}

const useNotificationsStore = defineStore("notifications", {
  state: (): NotificationState => ({
    items: [],
  }),
  actions: {
    notify(
      message: string,
      style: NotificationStyle,
      options?: NotificationOptions
    ) {
      options = { ...defaultOptions, style, ...options };

      const id = uuid();
      this.items.push({
        message,
        id,
        ...options,
      });

      if (options.timeout !== false) {
        setTimeout(() => {
          this.remove(id);
        }, options.timeout);
      }
    },

    success(message: string, options?: NotificationOptions) {
      this.notify(message, "success", options);
    },

    error(message: string, options?: NotificationOptions) {
      this.notify(message, "error", options);
    },

    warning(message: string, options?: NotificationOptions) {
      this.notify(message, "warning", options);
    },

    info(message: string, options?: NotificationOptions) {
      this.notify(message, "info", options);
    },

    remove(id: string) {
      const index = this.items.findIndex((item) => item.id === id);
      if (index > -1) {
        this.items.splice(index, 1);
      }
    },
  },
});

export default useNotificationsStore;
