import type { Board, Task } from "@/types";

import { defineStore } from "pinia";
import { findIndex } from "lodash";

interface BoardState {
  boards: Partial<Board>[];
  tasks: Partial<Task>[];
  selectedBoard?: string;
}

const useBoardsStore = defineStore("boards", {
  state: (): BoardState => ({
    boards: [],
    tasks: [],
    selectedBoard: undefined,
  }),

  getters: {
    getBoardById: (state) => (boardId: string) => {
      return state.boards.find((board) => board.id === boardId)!;
    },
  },

  actions: {
    add(board: Partial<Board>) {
      this.boards = [...this.boards, board];
    },
    update(data: Partial<Board>, id?: string) {
      if (id) {
        const boardIndex = findIndex(this.boards, { id });
        this.boards.splice(boardIndex, 1, data);
      }
    },
  },
});

export default useBoardsStore;
