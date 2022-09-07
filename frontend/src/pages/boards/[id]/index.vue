<script setup lang="ts">
import BoardDragDrop from "@/components/board/BoardDragDrop.vue";
import { useBoards } from "@/composables";
import { useBoardsStore } from "@/stores";
import type { Board } from "@/types";
import { nextTick, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const { getBoardById } = useBoardsStore();

const { board, deleteBoard, updateBoard } = useBoards();

const boardId = route.params.id as string;
board.value = ref<Partial<Board>>(getBoardById(boardId));

const titleInput = ref<HTMLInputElement | null>(null);
const titleValue = ref<string>(board.value?.title || "");
const titleInputVisible = ref<boolean>(false);

const updateTitle = () => {
  titleInputVisible.value = true;
  nextTick(() => titleInput.value?.focus());
};

const handleEnter = () => {
  const newBoard: Partial<Board> = {
    id: boardId,
    title: titleValue.value,
  };

  updateBoard(newBoard);

  titleInputVisible.value = false;
};

const handleCancel = () => {
  titleValue.value = board.value.title || "";
  titleInputVisible.value = false;
};

const handleDeleteBoard = async () => {
  if (confirm("Are you sure you want to delete the board?")) {
    deleteBoard(boardId);
  }
};
</script>

<template>
  <div>
    <div class="flex">
      <AppPageHeading v-if="!titleInputVisible" @click="updateTitle">{{
        board.title
      }}</AppPageHeading>
      <input
        v-else
        type="text"
        ref="titleInput"
        class="mr-5 mb-5 text-3xl w-full"
        v-model="titleValue"
        @keypress.enter="handleEnter"
        @keydown.esc="handleCancel"
        @blur="handleCancel"
      />
      <div>
        <BoardMenu :board="board" @deleteBoard="handleDeleteBoard" />
      </div>
    </div>
    <BoardDragDrop v-if="board" :board="boardId" />
  </div>
</template>

<style scoped>
.menu {
  @apply cursor-pointer;
}

.my-menu {
  @apply bg-white border border-orange-700 text-orange-700 hover:bg-orange-500 hover:text-white;
}
</style>
