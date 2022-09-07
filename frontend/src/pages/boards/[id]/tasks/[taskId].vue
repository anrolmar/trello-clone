<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import AppLabelsPicker from "@/components/ui/AppLabelsPicker.vue";
import { useLabels } from "@/composables";
import taskByIdQuery from "@/graphql/queries/taskById.query.gql";
import { useNotificationsStore } from "@/stores";
import type { Comment, Label, Task } from "@/types";
import { Button as KButton } from "@progress/kendo-vue-buttons";
import { Calendar as KCalendar } from "@progress/kendo-vue-dateinputs";
import {
  Dialog as KDialog,
  DialogActionsBar as KDialogActionsBar,
} from "@progress/kendo-vue-dialogs";
import { Editor as KEditor } from "@progress/kendo-vue-editor";
import { TextArea as KTextArea } from "@progress/kendo-vue-inputs";
import { useQuery } from "@vue/apollo-composable";
import { findIndex } from "lodash";
import { clone } from "lodash-es";
import { computed, ref, toRefs } from "vue";
import { useRouter } from "vue-router";

const props = defineProps<{
  taskId: string;
}>();

const { taskId } = toRefs(props);

const router = useRouter();
const notificationsStore = useNotificationsStore();
const {
  labels,
  createLabel,
  deleteLabel,
  updateLabel,
  updateLabelWithRelationships,
} = useLabels();

const comments = ref<Partial<Comment>[]>([]);
const newComment = ref<string>("");

const tools = [
  ["Bold", "Italic", "Underline", "Strikethrough"],
  ["AlignLeft", "AlignCenter", "AlignRight", "AlignJustify"],
  ["Indent", "Outdent"],
  ["OrderedList", "UnorderedList"],
  "FontSize",
  "FormatBlock",
  ["Undo", "Redo"],
  ["Link", "Unlink", "InsertImage", "ViewHtml"],
];

const {
  result: taskData,
  loading,
  onError: onErrorGettingTask,
  onResult: onResultGettingTask,
} = useQuery(taskByIdQuery, { id: taskId.value });
onErrorGettingTask(() => notificationsStore.error("Error loading the task"));
onResultGettingTask(() => {
  console.log("Task", taskData.value);
  labels.value = taskData.value?.labels.items || [];
  comments.value = JSON.parse(
    JSON.stringify(taskData.value.task.comments.items)
  );
});

const task = computed<Partial<Task>>(() => taskData.value?.task || null);
const selectedLabels = ref<Partial<Label>[]>(task.value?.labels || []);

const handleCloseDialog = () => router.push(`/boards/`);
const handleCreateLabel = (newLabel: Partial<Label>) => createLabel(newLabel);
const handleDeleteLabel = (label: Partial<Label>) => deleteLabel(label);
const handleUpdateLabel = (label: Partial<Label>) => updateLabel(label);

const handleAddLabelToTask = (label: Partial<Label>) => {
  const labelCloned = clone(label);
  if (task.value) labelCloned.tasks?.push(task.value);
  updateLabel(labelCloned);
  updateLabelWithRelationships(labelCloned);
};

const handleRemoveLabelFromTask = (label: Partial<Label>) => {
  const labelCloned = clone(label);
  const taskIndex = findIndex(labelCloned.tasks, { id: label.id });
  labelCloned.tasks?.splice(taskIndex, 1);
  updateLabel(labelCloned);
  updateLabelWithRelationships(labelCloned);
};

const handleAddComment = () => {
  comments.value.push({ message: newComment.value });
  newComment.value = "";
};
const handleUpdateTask = () => {};
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
          <div class="mt-7">
            <div class="form-label">
              <span class="k-icon k-i-comment"></span><label>Comments</label>
            </div>
            <KEditor
              :tools="tools"
              class="field"
              @change="newComment = $event.html"
            ></KEditor>
            <KButton
              :theme-color="'primary'"
              class="mt-2"
              @click="handleAddComment"
              >Add Comment</KButton
            >
          </div>
        </div>
        <div class="flex flex-col w-1/5 ml-5">
          <span class="font-bold">Add to Card</span>
          <span class="font-bold text-xs mt-2">Task Labels</span>
          <AppLabelsPicker
            :labels="labels"
            :selected="selectedLabels"
            @create="handleCreateLabel"
            @delete="handleDeleteLabel"
            @update="handleUpdateLabel"
            @select="handleAddLabelToTask"
            @deselect="handleRemoveLabelFromTask"
          />
          <div class="mt-3">
            <span class="font-bold">Task Due Date</span>
            <KCalendar :views="1" class="mt-2" v-model="task.dueAt" />
          </div>
        </div>
      </main>
      <KDialogActionsBar>
        <KButton @click="handleCloseDialog">Cancel</KButton>
        <KButton :theme-color="'primary'" @click="handleUpdateTask"
          >Save Task</KButton
        >
      </KDialogActionsBar>
    </KDialog>
  </div>
</template>

<style scoped>
.form-label {
  @apply font-bold w-full;
}

.form-label label {
  @apply ml-1;
}

.field {
  @apply mt-1 w-full;
}
</style>
