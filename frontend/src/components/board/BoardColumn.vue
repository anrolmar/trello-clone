<script lang="ts" setup>
import draggable from "vuedraggable";

import addTaskToColumnMutation from "@/graphql/mutations/addTaskToColumn.mutation.gql";
import { useBoardsStore, useNotificationsStore } from "@/stores";
import type { Column } from "@/types";
import { useMutation } from "@vue/apollo-composable";
import { cloneDeep } from "lodash-es";
import { nextTick, ref } from "vue";
import TaskCreator from "./TaskCreator.vue";

const props = defineProps<{
  column: Column;
}>();

const emit = defineEmits<{
  (e: "update", value: Column): void;
}>();

const notificationsStore = useNotificationsStore();
const boardsStore = useBoardsStore();

const column = ref<Column>(cloneDeep(props.column));
const {
  mutate: addTask,
  onDone: onAddTaskDone,
  onError: onAddTaskError,
} = useMutation(addTaskToColumnMutation);
onAddTaskDone(({ data }) => {
  column.value.taskIds.push(data.taskCreate.id);
  boardsStore.tasks = [...boardsStore.tasks, data.taskCreate];

  emit("update", column.value);
});
onAddTaskError(() => notificationsStore.error("Error creating the task"));

const addTaskToColumn = (taskToAdd: string) => {
  addTask({
    data: {
      title: taskToAdd,
      board: {
        connect: {
          id: boardsStore.selectedBoard,
        },
      },
    },
  });
};

const titleInput = ref<HTMLInputElement | null>(null);
const titleValue = ref<string>(column.value.title || "");
const titleInputVisible = ref<boolean>(false);

const updateTitle = () => {
  titleInputVisible.value = true;
  nextTick(() => titleInput.value?.focus());
};

const handleEnter = () => {
  column.value.title = titleValue.value;
  titleInputVisible.value = false;
  emit("update", column.value);
};

const handleCancel = () => {
  titleValue.value = column.value.title || "";
  titleInputVisible.value = false;
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
      <h2 v-if="!titleInputVisible" @click="updateTitle">{{ column.title }}</h2>
      <input
        v-else
        type="text"
        ref="titleInput"
        v-model="titleValue"
        class="w-full"
        @keypress.enter="handleEnter"
        @keydown.esc="handleCancel"
        @blur="handleCancel"
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
