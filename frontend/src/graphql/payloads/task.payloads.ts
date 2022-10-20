import type { Comment, Label, Task } from "@/types";

export interface TaskUpdatePayload {
  data: {
    description: string | undefined;
    dueAt: string;
  };
  filter: {
    id: string | undefined;
  };
}

export interface GetTaskByIdPayload {
  id: string;
}

export interface GetTasksPayload {
  tasksList: {
    items: Task[];
  };
}

export interface TaskResponsePayload {
  task: {
    id: string;
    title: string;
    description: string;
    dueAt: string;
    labels: {
      items: Label[];
    };
    comments: {
      items: Comment[];
    };
  };
}
