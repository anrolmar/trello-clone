<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import AppLabelsPicker from "@/components/ui/AppLabelsPicker.vue";
import { useLabels, useTasks } from "@/composables";
import type {
  GetTaskByIdPayload,
  TaskResponsePayload,
} from "@/graphql/payloads";
import taskByIdQuery from "@/graphql/queries/tasks/taskById.query.gql";
import { useBoardsStore, useNotificationsStore } from "@/stores";
import type { Comment, Label, Task } from "@/types";
import { Button as KButton } from "@progress/kendo-vue-buttons";
import { Calendar as KCalendar } from "@progress/kendo-vue-dateinputs";
import {
  Dialog as KDialog,
  DialogActionsBar as KDialogActionsBar,
} from "@progress/kendo-vue-dialogs";
import { TextArea as KTextArea } from "@progress/kendo-vue-inputs";
import { useQuery } from "@vue/apollo-composable";
import { computed, ref, toRefs } from "vue";
import { useRouter } from "vue-router";

const props = defineProps<{
  taskId: string;
}>();

const { taskId } = toRefs(props);

const router = useRouter();
const notificationsStore = useNotificationsStore();
const boardsStore = useBoardsStore();
const {
  selectedLabels,
  createLabel,
  deleteLabel,
  updateLabel,
  setTaskToLabel,
} = useLabels();

const { toTask, saveTask } = useTasks();

const task = ref<Task>();

const {
  loading,
  onError: onErrorGettingTask,
  onResult: onResultGettingTask,
} = useQuery<TaskResponsePayload, GetTaskByIdPayload>(taskByIdQuery, {
  id: taskId.value,
});
onErrorGettingTask(() => notificationsStore.error("Error loading the task"));
onResultGettingTask(({ data }) => {
  task.value = toTask(data.task);
  selectedLabels.value = task.value?.labels || [];
});

const taskDueAt = computed({
  get: () =>
    task.value && task.value.dueAt ? new Date(task.value.dueAt) : new Date(),
  set: (value) => {
    if (task.value) task.value.dueAt = value;
  },
});
const comments = computed(() => task.value?.comments);

const handleCloseDialog = () => router.push(`/boards/`);
const handleCreateLabel = (newLabel: Partial<Label>) => createLabel(newLabel);
const handleDeleteLabel = (label: Partial<Label>) => deleteLabel(label);
const handleUpdateLabel = (label: Partial<Label>) => updateLabel(label);

const handleAddLabelToTask = (label: Partial<Label>) => {
  updateLabel(label);
  setTaskToLabel(label.id, task.value?.id, false);
};

const handleRemoveLabelFromTask = (label: Partial<Label>) => {
  updateLabel(label);
  setTaskToLabel(label.id, task.value?.id, true);
};

const handleChangeComments = (newComments: Partial<Comment>[]) => {
  if (task.value) task.value.comments = newComments;
};

const handleSaveTask = () => {
  saveTask(task.value);
  router.push(`/boards/${boardsStore.selectedBoard}`);
};
</script>

<template>
  <div>
    <AppLoader v-if="loading" :overlay="true" />

    <KDialog
      class="overflow-auto"
      v-if="task"
      :title="task.title"
      @close="handleCloseDialog"
    >
      <main class="flex">
        <div class="flex flex-col w-4/5">
          <div>
            <div class="form-label">
              <span class="k-icon k-i-align-left"></span
              ><label>Description</label>
            </div>
            <KTextArea class="field" v-model="task.description"></KTextArea>
          </div>
          <Comments
            :comments="comments"
            @changeComments="handleChangeComments"
          />
        </div>
        <div class="flex flex-col w-1/5 ml-5">
          <span class="font-bold">Add to Card</span>
          <span class="font-bold text-xs mt-2">Task Labels</span>
          <AppLabelsPicker
            :labels="boardsStore.labels"
            :selected="selectedLabels"
            @create="handleCreateLabel"
            @delete="handleDeleteLabel"
            @update="handleUpdateLabel"
            @select="handleAddLabelToTask"
            @deselect="handleRemoveLabelFromTask"
          />
          <div class="mt-3">
            <span class="font-bold">Task Due Date</span>
            <KCalendar :views="1" class="mt-2" v-model="taskDueAt" />
          </div>
        </div>
      </main>
      <KDialogActionsBar>
        <KButton @click="handleCloseDialog">Cancel</KButton>
        <KButton :theme-color="'primary'" @click="handleSaveTask"
          >Save Task</KButton
        >
      </KDialogActionsBar>
    </KDialog>
  </div>
</template>
