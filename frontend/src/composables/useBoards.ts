import { useBoardsStore, useNotificationsStore } from "@/stores";

import type { Board } from "@/types";
import createBoardGQLMutation from "@/graphql/mutations/createBoard.mutation.gql";
import deleteBoardGQLMutation from "@/graphql/mutations/deleteBoard.mutation.gql";
import { findIndex } from "lodash";
import { ref } from "vue";
import updateBoardGQLMutation from "@/graphql/mutations/updateBoard.mutation.gql";
import { useMutation } from "@vue/apollo-composable";
import { useRouter } from "vue-router";

const useBoards = (): any => {
  const router = useRouter();
  const notificationsStore = useNotificationsStore();
  const boardsStore = useBoardsStore();

  const board = ref<Partial<Board>>();

  const createBoard = (newBoard: Partial<Board>) => {
    const {
      mutate: createBoardMutation,
      onDone: onCreateBoardDone,
      onError: onCreateBoardError,
    } = useMutation(createBoardGQLMutation);
    onCreateBoardDone(({ data }) => {
      boardsStore.add(data.boardCreate);
      notificationsStore.success("Board created!");
    });
    onCreateBoardError(() =>
      notificationsStore.error("Error creating the board")
    );

    const newBoardPayload = {
      data: {
        title: newBoard.title,
      },
    };
    createBoardMutation(newBoardPayload);
  };

  const deleteBoard = (id: string): void => {
    const {
      mutate: deleteBoardMutation,
      onDone: onDeleteBoardDone,
      onError: onDeleteBoardError,
    } = useMutation(deleteBoardGQLMutation);

    onDeleteBoardDone(() => {
      router.push("/");
      notificationsStore.success("Board successfully deleted!");
    });
    onDeleteBoardError(() => notificationsStore.error("Error deleting board"));

    deleteBoardMutation({ id });
    router.push("/");
    notificationsStore.success("Board successfully deleted");
  };

  const updateBoard = (newBoard: Partial<Board>): void => {
    const {
      mutate: updateBoardMutation,
      onDone: onUpdateBoardDone,
      onError: onUpdateBoardError,
    } = useMutation(updateBoardGQLMutation);

    onUpdateBoardDone(({ data }) => {
      const selectedBoardIndex = findIndex(boardsStore.boards, {
        id: newBoard.id,
      });
      const updatedBoards = boardsStore.boards.map((item, index) => {
        if (index !== selectedBoardIndex) return item;
        return data.boardUpdate;
      });

      boardsStore.boards = updatedBoards;
      board.value = data.boardUpdate;
      notificationsStore.success("Board updated!");
    });
    onUpdateBoardError(() =>
      notificationsStore.error("Error updating the board")
    );

    const updateBoardPayload = {
      data: {
        id: newBoard.id,
        title: newBoard.title,
      },
    };
    updateBoardMutation(updateBoardPayload);
  };

  return {
    board,
    createBoard,
    deleteBoard,
    updateBoard,
  };
};

export default useBoards;
