import type {
  CreateLabelResponse,
  LabelCreatePayload,
  LabelDeletePayload,
  LabelUpdatePayload,
  UpdateLabelResponse,
} from "@/graphql/payloads";
import { useBoardsStore, useNotificationsStore } from "@/stores";

import type { Label } from "@/types";
import createLabelGQLMutation from "@/graphql/mutations/labels/createLabel.mutation.gql";
import deleteLabelGQLMutation from "@/graphql/mutations/labels/deleteLabel.mutation.gql";
import { ref } from "vue";
import updateLabelGQLMutation from "@/graphql/mutations/labels/updateLabel.mutation.gql";
import { useMutation } from "@vue/apollo-composable";

const toLabel = (data: any): Partial<Label> => {
  return {
    id: data.id || null,
    label: data.label || "",
    color: data.color || "",
    board: data.board || null,
  };
};

const useLabels = (): any => {
  const notificationsStore = useNotificationsStore();
  const boardsStore = useBoardsStore();

  const selectedLabels = ref<Partial<Label>[]>([]);

  const {
    mutate: createLabelMutation,
    onError: onErrorCreatingLabel,
    onDone: onDoneCreatingLabel,
  } = useMutation<CreateLabelResponse, LabelCreatePayload>(
    createLabelGQLMutation
  );
  onErrorCreatingLabel(() => {
    notificationsStore.error("Error creating the label");
  });
  onDoneCreatingLabel(({ data }) => {
    boardsStore.addLabel(toLabel(data?.labelCreate));
    notificationsStore.success("Label created successfully!");
  });

  const {
    mutate: deleteLabelMutation,
    onError: onErrorDeletingLabel,
    onDone: onDeletingLabel,
  } = useMutation<any, LabelDeletePayload>(deleteLabelGQLMutation);
  onErrorDeletingLabel(() =>
    notificationsStore.error("Error deleting the label")
  );
  onDeletingLabel(() =>
    notificationsStore.success("Label deleted successfully!")
  );

  const {
    mutate: updateLabelMutation,
    onError: onErrorUpdatingLabel,
    onDone: onUpdatingLabel,
  } = useMutation<UpdateLabelResponse, LabelUpdatePayload>(
    updateLabelGQLMutation
  );
  onErrorUpdatingLabel(() =>
    notificationsStore.error("Error updating the label")
  );
  onUpdatingLabel(({ data }) => {
    const updatedLabel = toLabel(data?.labelUpdate);
    boardsStore.updateLabel(updatedLabel, updatedLabel.id);
    notificationsStore.success("Label updated successfully!");
  });

  const createLabel = (newLabel: Partial<Label>) => {
    createLabelMutation({
      data: {
        label: newLabel.label,
        color: newLabel.color,
      },
    });
  };

  const deleteLabel = ({ id }: { id: string }) => {
    deleteLabelMutation({ id });
    boardsStore.deleteLabel(id);
  };

  const updateLabel = (label: Partial<Label>) => {
    updateLabelMutation({
      data: {
        label: label.label,
      },
      filter: { id: label.id },
    });
  };

  const setBoardToLabel = (
    labelId: string,
    boardId: string,
    remove: boolean
  ) => {
    const boardPayload = !remove
      ? { connect: { id: boardId } }
      : { disconnect: { id: boardId } };

    updateLabelMutation({
      data: {
        board: boardPayload,
      },
      filter: { id: labelId },
    });
  };
  const setTaskToLabel = (labelId: string, taskId: string, remove: boolean) => {
    const taskPayload = !remove
      ? { connect: { id: taskId } }
      : { disconnect: { id: taskId } };

    updateLabelMutation({
      data: {
        tasks: taskPayload,
      },
      filter: { id: labelId },
    });
  };

  return {
    selectedLabels,
    createLabel,
    deleteLabel,
    updateLabel,
    setBoardToLabel,
    setTaskToLabel,
  };
};

export default useLabels;
