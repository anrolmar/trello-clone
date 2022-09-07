<script setup lang="ts">
import { useBoards } from "@/composables";
import boardsQuery from "@/graphql/queries/boards.query.gql";
import tasksQuery from "@/graphql/queries/tasks.query.gql";
import { useBoardsStore, useNotificationsStore } from "@/stores";
import type { Board } from "@/types";
import { useQuery } from "@vue/apollo-composable";

const notificationsStore = useNotificationsStore();
const boardsStore = useBoardsStore();
const { createBoard } = useBoards();

const {
  loading,
  onError: onGetBoardsError,
  onResult: onGetBoardsResult,
} = useQuery(boardsQuery);
onGetBoardsResult(
  ({ data }) => (boardsStore.boards = data.boardsList?.items || [])
);
onGetBoardsError(() => notificationsStore.error("Error loading boards"));

const { onError: onGetTasksError, onResult: onGetTasksResult } =
  useQuery(tasksQuery);
onGetTasksResult(
  ({ data }) => (boardsStore.tasks = data.tasksList?.items || [])
);
onGetTasksError(() => notificationsStore.error("Error loading tasks"));

const handleCreateBoard = () => {
  const newBoard: Partial<Board> = {
    title: "New board",
  };
  createBoard(newBoard);
};
</script>

<template>
  <h1 class="title">Boards</h1>
  <div class="board-list">
    <BoardCard
      v-for="board in boardsStore.boards"
      :key="board.id"
      :board="board"
    ></BoardCard>
    <div class="board-actions">
      <AppButton :fill-mode="'flat'" @click="handleCreateBoard"
        >New Board <span class="k-icon k-i-plus"></span
      ></AppButton>
    </div>
  </div>
  <AppLoader v-if="loading" :overlay="true" />
</template>

<style scoped>
h1 {
  @apply text-xl font-normal leading-normal mt-0 mb-2;
}

.board-list {
  @apply flex flex-wrap;
}

.board-actions {
  @apply flex items-center;
}
</style>
