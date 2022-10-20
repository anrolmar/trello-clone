import type { Label } from "@/types";
import type { RelationshipPayload } from ".";

export interface LabelCreatePayload {
  data: {
    label: string | undefined;
    color: string | undefined;
  };
}

export interface LabelDeletePayload {
  id: string;
}

export interface LabelUpdatePayload {
  data: {
    label?: string | undefined;
    board?: RelationshipPayload;
    tasks?: RelationshipPayload;
  };
  filter: {
    id: string | undefined;
  };
}

export interface GetLabelsPayload {
  labelsList: {
    items: Label[];
  };
}

export interface CreateLabelResponse {
  labelCreate: Partial<Label>;
}

export interface UpdateLabelResponse {
  labelUpdate: Partial<Label>;
}
