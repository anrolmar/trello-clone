<script lang="ts" setup>
import { useBoards } from "@/composables";
import { useBoardsStore } from "@/stores";
import type { Board, Column } from "@/types";
import { findIndex } from "lodash";
import { v4 as uuid } from "uuid";
import { ref } from "vue";
import draggable from "vuedraggable";

const props = defineProps<{
  board: string;
}>();

const { updateBoard } = useBoards();
const boardsStore = useBoardsStore();

const board = ref<Partial<Board>>();
board.value = boardsStore.getBoardById(props.board);
boardsStore.selectedBoard = props.board;

const columns = ref<Column[]>(
  typeof board.value.order === "string"
    ? JSON.parse(board.value.order as string)
    : board.value.order
);

const handleUpdateBoard = () => {
  const newBoard: Partial<Board> = {
    id: props.board,
    order: JSON.stringify(columns.value),
  };

  updateBoard(newBoard);
};

const handleAddColumn = () => {
  if (!columns.value) columns.value = [];
  columns.value = [
    ...columns.value,
    {
      id: uuid(),
      title: "New column",
      taskIds: [],
    },
  ];

  handleUpdateBoard();
};

const handleUpdateColumn = (column: Column) => {
  const columnIndex = findIndex(columns.value, { id: column.id });
  columns.value.splice(columnIndex, 1, column);

  handleUpdateBoard();
};
</script>

<template>
  <div class="columns">
    <draggable
      :list="columns"
      group="columns"
      item-key="id"
      class="flex flex-grow-0 flex-shrink-0"
    >
      <template #item="{ element: column }">
        <BoardColumn :column="column" @update="handleUpdateColumn" />
      </template>
    </draggable>
    <AppButton :fill-mode="'flat'" @click="handleAddColumn">
      New Column <span class="k-icon k-i-plus"></span>
    </AppButton>
  </div>
</template>

<style scoped>
.columns {
  @apply flex items-start py-12 max-w-full overflow-x-auto;
}
</style>
