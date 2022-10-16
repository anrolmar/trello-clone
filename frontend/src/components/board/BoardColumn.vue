<script lang="ts" setup>
import draggable from "vuedraggable";

import { useTasks } from "@/composables";
import { useBoardsStore } from "@/stores";
import type { Column } from "@/types";
import { cloneDeep } from "lodash-es";
import { computed, ref } from "vue";

const props = defineProps<{
  column: Column;
}>();

const emit = defineEmits<{
  (e: "update", value: Column): void;
}>();

const boardsStore = useBoardsStore();
const { createTask } = useTasks();

const column = ref<Column>(cloneDeep(props.column));
const columnTitle = computed(() => column.value.title);

const addTaskToColumn = (taskToAdd: string) =>
  createTask(taskToAdd, emit, column);

const handleUpdate = (value: string) => {
  column.value.title = value;
  emit("update", column.value);
};

const handleChangeColumn = (event: any) => {
  if (event.added) {
    if (
      column.value.taskIds.find((taskId) => taskId === event.added.element)
        ?.length === 0
    )
      column.value.taskIds.push(event.added.element);
  } else if (event.removed)
    column.value.taskIds = column.value.taskIds.filter(
      (taskId) => taskId !== event.removed.element
    );

  emit("update", column.value);
};
</script>

<template>
  <div class="column">
    <div>
      <AppPageHeading
        heading="h2"
        :title="columnTitle"
        @update="handleUpdate"
      />
      <draggable
        :list="column.taskIds"
        group="tasks"
        item-key="uid"
        class="mt-4 min-h-[400px]"
        @change="handleChangeColumn"
      >
        <template #item="{ element: taskId }">
          <TaskCard
            v-if="boardsStore.tasks.find((task) => task.id === taskId)"
            :task="boardsStore.tasks.find((task) => task.id === taskId)"
            class="task"
          />
        </template>
      </draggable>
      <TaskCreator @addTask="addTaskToColumn" />
    </div>
  </div>
</template>

<style scoped>
.column {
  @apply bg-gray-100 flex flex-col justify-between rounded-lg px-3 py-3 mr-4 w-[300px];
}
.task {
  @apply mt-3 cursor-move;
}
</style>
