import type {
  BoardCreatePayload,
  BoardDeletePayload,
  BoardUpdatePayload,
  CreateBoardResponse,
  UpdateBoardResponse,
} from "@/graphql/payloads";
import { useBoardsStore, useNotificationsStore } from "@/stores";

import type { Board } from "@/types";
import createBoardGQLMutation from "@/graphql/mutations/boards/createBoard.mutation.gql";
import deleteBoardGQLMutation from "@/graphql/mutations/boards/deleteBoard.mutation.gql";
import updateBoardGQLMutation from "@/graphql/mutations/boards/updateBoard.mutation.gql";
import { useMutation } from "@vue/apollo-composable";
import { useRouter } from "vue-router";

const toBoardStore = (data: any): Partial<Board> => {
  return {
    id: data.id || null,
    title: data.title || "",
    order: data.order || [],
    image: data.image || undefined,
  };
};

const useBoards = () => {
  const router = useRouter();
  const notificationsStore = useNotificationsStore();
  const boardsStore = useBoardsStore();

  const {
    mutate: createBoardMutation,
    onDone: onCreateBoardDone,
    onError: onCreateBoardError,
  } = useMutation<CreateBoardResponse, BoardCreatePayload>(
    createBoardGQLMutation
  );
  onCreateBoardDone(({ data }) => {
    boardsStore.addBoard(toBoardStore(data?.boardCreate));
    notificationsStore.success("Board created!");
  });
  onCreateBoardError(() =>
    notificationsStore.error("Error creating the board")
  );

  const {
    mutate: deleteBoardMutation,
    onDone: onDeleteBoardDone,
    onError: onDeleteBoardError,
  } = useMutation<any, BoardDeletePayload>(deleteBoardGQLMutation);

  onDeleteBoardDone(() => {
    boardsStore.deleteBoard(boardsStore.selectedBoard);
    router.push("/boards");
    notificationsStore.success("Board successfully deleted!");
  });
  onDeleteBoardError(() => notificationsStore.error("Error deleting board"));

  const {
    mutate: updateBoardMutation,
    onDone: onUpdateBoardDone,
    onError: onUpdateBoardError,
  } = useMutation<UpdateBoardResponse, BoardUpdatePayload>(
    updateBoardGQLMutation
  );

  onUpdateBoardDone(({ data }) => {
    const updatedBoard = toBoardStore(data?.boardUpdate);
    boardsStore.updateBoard(updatedBoard, boardsStore.selectedBoard);

    notificationsStore.success("Board updated!");
  });
  onUpdateBoardError(() =>
    notificationsStore.error("Error updating the board")
  );

  const createBoard = (newBoard: Partial<Board>) => {
    const newBoardPayload = {
      title: newBoard.title,
    };
    createBoardMutation({ data: newBoardPayload });
  };

  const deleteBoard = (id: string): void => {
    deleteBoardMutation({ id });
  };

  const updateBoard = (newBoard: Partial<Board>): void => {
    const updateBoardPayload = newBoard.order
      ? {
          id: newBoard.id,
          title: newBoard.title,
          order: newBoard.order,
        }
      : {
          id: newBoard.id,
          title: newBoard.title,
        };

    updateBoardMutation({ data: updateBoardPayload });
  };

  return {
    createBoard,
    deleteBoard,
    updateBoard,
  };
};

export default useBoards;
