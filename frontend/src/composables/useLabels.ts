import type { Label } from "@/types";
import createLabelGQLMutation from "@/graphql/mutations/labels/createLabel.mutation.gql";
import deleteLabelGQLMutation from "@/graphql/mutations/labels/deleteLabel.mutation.gql";
import { findIndex } from "lodash";
import { ref } from "vue";
import updateLabelGQLMutation from "@/graphql/mutations/labels/updateLabel.mutation.gql";
import { useMutation } from "@vue/apollo-composable";
import { useNotificationsStore } from "@/stores";

const useLabels = (): any => {
  const notificationsStore = useNotificationsStore();

  const labels = ref<Partial<Label>[]>([]);
  const selectedLabels = ref<Partial<Label>[]>([]);

  const {
    mutate: createLabelMutation,
    onError: onErrorCreatingLabel,
    onDone: onDoneCreatingLabel,
  } = useMutation(createLabelGQLMutation);
  onErrorCreatingLabel(() => {
    notificationsStore.error("Error creating the label");
  });
  onDoneCreatingLabel(({ data }) => {
    labels.value = [...labels.value, data.labelCreate];
    notificationsStore.success("Label created successfully!");
  });

  const {
    mutate: deleteLabelMutation,
    onError: onErrorDeletingLabel,
    onDone: onDeletingLabel,
  } = useMutation(deleteLabelGQLMutation);
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
  } = useMutation(updateLabelGQLMutation);
  onErrorUpdatingLabel(() =>
    notificationsStore.error("Error updating the label")
  );
  onUpdatingLabel(() =>
    notificationsStore.success("Label updated successfully!")
  );

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
    const labelIndex = findIndex(labels.value, { id });
    labels.value.splice(labelIndex, 1);
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
    labels,
    selectedLabels,
    createLabel,
    deleteLabel,
    updateLabel,
    setBoardToLabel,
    setTaskToLabel,
  };
};

export default useLabels;
