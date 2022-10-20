<script lang="ts" setup>
import { useLabels } from "@/composables";
import attachImageToBoardMutation from "@/graphql/mutations/boards/attachImageToBoard.mutation.gql";
import type {
  AttachImagePayload,
  UpdateBoardResponse,
} from "@/graphql/payloads";
import { useBoardsStore, useNotificationsStore } from "@/stores";
import type { Board, Label } from "@/types";
import { Button as KButton } from "@progress/kendo-vue-buttons";
import { Popup as KPopup } from "@progress/kendo-vue-popup";
import { useMutation } from "@vue/apollo-composable";
import { onClickOutside } from "@vueuse/core";
import { ref } from "vue";
import AppImageDropZone from "../ui/AppImageDropZone.vue";

const props = defineProps<{
  board: Partial<Board>;
}>();

const emit = defineEmits<{
  (e: "deleteBoard", payload: null): void;
}>();

const boardsStore = useBoardsStore();
const notificationsStore = useNotificationsStore();
const { createLabel, deleteLabel, updateLabel, setBoardToLabel } = useLabels();

const selectedLabels = ref<Partial<Label>[]>(props.board.labels || []);

const show = ref<boolean>(false);
const menu = ref(null);
onClickOutside(menu, () => setTimeout(() => (show.value = false), 2));

const {
  mutate: attachImageToBoard,
  onError: onErrorAttachingImage,
  onDone: onDoneAttachingImage,
  loading: imageLoading,
} = useMutation<UpdateBoardResponse, AttachImagePayload>(
  attachImageToBoardMutation
);
onErrorAttachingImage((error) => {
  console.log("Error", error);
  notificationsStore.error("Error setting board image");
});
onDoneAttachingImage(({ data }) => {
  boardsStore.updateBoard(data?.boardUpdate, data?.boardUpdate.id);
  notificationsStore.success("Board updated successfully!!");
});

const handleUploadImage = (event: any) => {
  attachImageToBoard({
    id: props.board.id,
    imageId: event,
  });
};

const handleCreateLabel = (newLabel: Partial<Label>) => createLabel(newLabel);
const handleDeleteLabel = (label: Partial<Label>) => deleteLabel(label);
const handleUpdateLabel = (label: Partial<Label>) => updateLabel(label);

const handleAddLabelToBoard = (label: Partial<Label>) => {
  updateLabel(label);
  setBoardToLabel(label.id, boardsStore.selectedBoard, false);
};

const handleRemoveLabelFromBoard = (label: Partial<Label>) => {
  updateLabel(label);
  setBoardToLabel(label.id, boardsStore.selectedBoard, true);
};
</script>

<template>
  <div>
    <KButton
      icon="folder"
      themeColor="primary"
      fillMode="outline"
      @click="show = !show"
      ref="button"
      >Show Menu
    </KButton>
    <KPopup
      :anchor="'button'"
      :anchorAlign="{
        vertical: 'bottom',
        horizontal: 'right',
      }"
      :popupAlign="{
        horizontal: 'right',
        vertical: 'top',
      }"
      :show="show"
    >
      <div class="p-5" ref="menu">
        <ul>
          <li class="button-element">
            <button @click="$emit('deleteBoard', null)">
              <span class="k-icon k-i-delete"></span>
              Delete board
            </button>
          </li>
          <li>
            <strong>Board Image</strong>
            <AppImageDropZone
              class="aspect-video w-56"
              :image="board.image?.downloadUrl"
              :loading="imageLoading"
              @upload="handleUploadImage"
            />
          </li>
          <li>
            <AppLabelsPicker
              :labels="boardsStore.labels"
              :selected="selectedLabels"
              @create="handleCreateLabel"
              @delete="handleDeleteLabel"
              @update="handleUpdateLabel"
              @select="handleAddLabelToBoard"
              @deselect="handleRemoveLabelFromBoard"
            />
          </li>
        </ul>
      </div>
    </KPopup>
  </div>
</template>

<style scoped>
ul li {
  @apply p-2;
  border-bottom: 1px solid #eee;
}

ul li:last-of-type {
  border-bottom: none;
}

.button-element {
  @apply text-red-500 whitespace-nowrap;
}
</style>
