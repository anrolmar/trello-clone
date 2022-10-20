import type { Board, Column } from "@/types";

export interface BoardCreatePayload {
  data: {
    title: string | undefined;
  };
}

export interface BoardDeletePayload {
  id: string;
}

export interface BoardUpdatePayload {
  data: {
    id: string | undefined;
    title: string | undefined;
    order?: Column[] | string | undefined;
  };
}

export interface GetBoardsResponse {
  boardsList: {
    items: Board[];
  };
}

export interface UpdateBoardResponse {
  boardUpdate: Partial<Board>;
}

export interface CreateBoardResponse {
  boardCreate: Partial<Board>;
}
