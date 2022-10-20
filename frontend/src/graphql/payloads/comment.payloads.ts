import type { RelationshipPayload } from ".";

export interface CommentCreatePayload {
  data: {
    message: string | undefined;
    task: RelationshipPayload;
  };
}

export interface CommentDeletePayload {
  filter: {
    task: {
      id: {
        equals: string | undefined;
      };
    };
  };
  force: boolean;
}
