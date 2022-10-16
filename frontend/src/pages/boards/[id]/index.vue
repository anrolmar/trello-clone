<script setup lang="ts">
import { useBoards } from "@/composables";
import { useBoardsStore } from "@/stores";
import type { Board } from "@/types";
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const { getBoardById } = useBoardsStore();

const { deleteBoard, updateBoard } = useBoards();
let { board } = useBoards();

const boardId = route.params.id as string;
board.value = getBoardById(boardId);

const boardTitle = computed(() => board.value?.title);

const handleUpdate = (value: string) => {
  const newBoard: Partial<Board> = {
    id: boardId,
    title: value,
  };

  updateBoard(newBoard);
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
      <AppPageHeading heading="h1" :title="boardTitle" @update="handleUpdate" />
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
