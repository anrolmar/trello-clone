import type { Column, Comment, Task } from "@/types";
import { useBoardsStore, useNotificationsStore } from "@/stores";

import type { Ref } from "vue";
import createCommentMutationGQL from "@/graphql/mutations/tasks/createComment.mutation.gql";
import createTaskMutationGQL from "@/graphql/mutations/tasks/createTask.mutation.gql";
import deleteCommentsByFilterMutationGQL from "@/graphql/mutations/tasks/deleteCommentsByFilter.mutation.gql";
import updateTaskMutationGQL from "@/graphql/mutations/tasks/updateTask.mutation.gql";
import { useDateFormat } from "@vueuse/core";
import { useMutation } from "@vue/apollo-composable";

const useTasks = (comments?: Partial<Comment>[]): any => {
  const notificationsStore = useNotificationsStore();
  const boardsStore = useBoardsStore();

  const toTask = (task: any): Partial<Task> => {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      dueAt: task.dueAt,
      labels: task.labels.items || [],
      comments: task.comments.items || [],
    };
  };

  const { mutate: createTaskMutation, onError: onErrorCreatingTask } =
    useMutation(createTaskMutationGQL);
  onErrorCreatingTask(() =>
    notificationsStore.error("Error creating the task")
  );
  const createTask = (taskName: string, emit: any, column: Ref<Column>) => {
    createTaskMutation({
      data: {
        title: taskName,
        board: {
          connect: {
            id: boardsStore.selectedBoard,
          },
        },
      },
    }).then((result) => {
      column.value.taskIds.push(result?.data.taskCreate.id);
      boardsStore.tasks = [...boardsStore.tasks, result?.data.taskCreate];

      emit("update", column.value);
    });
  };

  const {
    mutate: createCommentMutation,
    onDone: onDoneCreatingComment,
    onError: onErrorCreatingComment,
  } = useMutation(createCommentMutationGQL);
  onDoneCreatingComment(({ data }) => comments?.push(data.commentCreate));
  onErrorCreatingComment(() =>
    notificationsStore.error("Error saving the comment")
  );

  const saveComments = (
    commentsToSave?: Partial<Comment>[],
    taskId?: string
  ): void => {
    commentsToSave?.forEach((comment) => {
      createCommentMutation({
        data: {
          message: comment.message,
          task: { connect: { id: taskId } },
        },
      });
    });
  };

  const {
    mutate: deleteCommentsByFilterMutation,
    onDone: onDoneDeletingComments,
    onError: onErrorDeletingComments,
  } = useMutation(deleteCommentsByFilterMutationGQL);
  onDoneDeletingComments(() =>
    saveComments(taskToSave.comments, taskToSave.id)
  );
  onErrorDeletingComments(() => {
    notificationsStore.error("Error deleting the comments");
  });
  const deleteCommentsByFilter = (taskId?: string) => {
    deleteCommentsByFilterMutation({
      filter: {
        task: { id: { equals: taskId } },
      },
      force: true,
    });
  };

  let taskToSave: Partial<Task>;
  const {
    mutate: updateTaskMutation,
    onDone: onDoneUpdatingTask,
    onError: onErrorUpdatingTask,
  } = useMutation(updateTaskMutationGQL);
  onDoneUpdatingTask(() => {
    deleteCommentsByFilter(taskToSave.id);
    notificationsStore.success("Task updated successfully!!");
  });
  onErrorUpdatingTask(() =>
    notificationsStore.error("Error updating the task")
  );

  const saveTask = (task: Partial<Task>): void => {
    taskToSave = task;
    updateTaskMutation({
      data: {
        description: task.description,
        dueAt: useDateFormat(task.dueAt, "YYYY-MM-DD").value,
      },
      filter: {
        id: task.id,
      },
    });
  };

  return {
    comments,
    toTask,
    createTask,
    saveTask,
  };
};

export default useTasks;
