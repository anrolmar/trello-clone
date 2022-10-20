import type { Board, Label, Task } from "@/types";

import { defineStore } from "pinia";
import { findIndex } from "lodash";

interface BoardState {
  boards: Partial<Board>[];
  tasks: Partial<Task>[];
  labels: Partial<Label>[];
  selectedBoard?: string;
}

const useBoardsStore = defineStore("boards", {
  state: (): BoardState => ({
    boards: [],
    tasks: [],
    labels: [],
    selectedBoard: undefined,
  }),

  getters: {
    getBoardById: (state) => (boardId: string) => {
      return state.boards.find((board) => board.id === boardId)!;
    },
    getLabelsByBoard: (state) => (): Partial<Label>[] => {
      return state.labels.filter(
        (label) => label.board?.id === state.selectedBoard
      );
    },
  },

  actions: {
    addBoard(board: Partial<Board>) {
      this.boards = [...this.boards, board];
    },
    addLabel(label: Partial<Label>) {
      this.labels = [...this.labels, label];
    },
    updateBoard(data: Partial<Board> | undefined, id?: string) {
      if (data && id) {
        const boardIndex = findIndex(this.boards, { id });
        this.boards = [
          ...this.boards.slice(0, boardIndex),
          data,
          ...this.boards.slice(boardIndex + 1),
        ];
      }
    },
    updateLabel(data: Partial<Label> | undefined, id?: string) {
      if (data && id) {
        const labelIndex = findIndex(this.labels, { id });
        this.labels = [
          ...this.labels.slice(0, labelIndex),
          data,
          ...this.labels.slice(labelIndex + 1),
        ];
      }
    },
    deleteBoard(id?: string) {
      if (id) {
        const boardIndex = findIndex(this.boards, { id });
        this.boards = [
          ...this.boards.slice(0, boardIndex),
          ...this.boards.slice(boardIndex + 1),
        ];
      }
    },
    deleteLabel(id?: string) {
      if (id) {
        const labelIndex = findIndex(this.labels, { id });
        this.labels = [
          ...this.labels.slice(0, labelIndex),
          ...this.labels.slice(labelIndex + 1),
        ];
      }
    },
  },
});

export default useBoardsStore;
