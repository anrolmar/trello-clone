import { useBoardsStore, useNotificationsStore } from "@/stores";

import type { Label } from "@/types";
import createLabelGQLMutation from "@/graphql/mutations/createLabel.mutation.gql";
import deleteLabelGQLMutation from "@/graphql/mutations/deleteLabel.mutation.gql";
import { findIndex } from "lodash";
import { ref } from "vue";
import updateLabelGQLMutation from "@/graphql/mutations/updateLabel.mutation.gql";
import { useMutation } from "@vue/apollo-composable";

const useLabels = (): any => {
  const boardsStore = useBoardsStore();
  const notificationsStore = useNotificationsStore();

  const labels = ref<Partial<Label>[]>([]);

  const createLabel = (newLabel: Partial<Label>) => {
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

    createLabelMutation({
      data: {
        label: newLabel.label,
        color: newLabel.color,
      },
    });
  };

  const deleteLabel = ({ id }: { id: string }) => {
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

    deleteLabelMutation({ id });
    const labelIndex = findIndex(labels.value, { id });
    labels.value.splice(labelIndex, 1);
  };

  const updateLabel = (label: Partial<Label>) => {
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

    updateLabelMutation({
      data: {
        label: label.label,
      },
      filter: { id: label.id },
    });
  };

  const updateLabelWithRelationships = (label: Partial<Label>) => {
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

    const boardPayload = label.board
      ? { connect: { id: boardsStore.selectedBoard } }
      : { disconnect: { id: boardsStore.selectedBoard } };

    if (label.tasks) {
      label.tasks.forEach((task) => {
        updateLabelMutation({
          data: {
            board: boardPayload,
            task: { connect: { id: task.id } },
          },
          filter: { id: label.id },
        });
      });
    } else {
      updateLabelMutation({
        data: {
          board: boardPayload,
        },
        filter: { id: label.id },
      });
    }
  };

  return {
    labels,
    createLabel,
    deleteLabel,
    updateLabel,
    updateLabelWithRelationships,
  };
};

export default useLabels;
