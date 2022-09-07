<script lang="ts" setup>
import type { Task } from "@/types";
import { Chip as KChip } from "@progress/kendo-vue-buttons";
import {
  Avatar as KAvatar,
  Card as KCard,
  CardHeader as KCardHeader,
  CardSubtitle as KCardSubtitle,
  CardTitle as KCardTitle,
} from "@progress/kendo-vue-layout";
import { useDateFormat } from "@vueuse/core";

const props = defineProps<{
  task: Task;
}>();

const dueAt = useDateFormat(props.task.dueAt, "MM/DD");
</script>

<template>
  <RouterLink :to="`/boards/${$route.params.id}/tasks/${task.id}`">
    <KCard class="task">
      <KCardHeader>
        <div class="flex justify-between">
          <KCardTitle>{{ task.title }}</KCardTitle>
          <KAvatar type="image" size="medium" shape="circle">
            <img
              style="width: 45px; height: 45px"
              src="https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png"
            />
          </KAvatar>
        </div>
        <KCardSubtitle v-if="task.dueAt">
          <KChip
            :text="dueAt"
            value="chip"
            rounded="full"
            icon="k-i-clock"
            theme-color="info"
          />
        </KCardSubtitle>
      </KCardHeader>
    </KCard>
  </RouterLink>
</template>

<style scoped>
.task {
  @apply mb-2;
}
</style>
