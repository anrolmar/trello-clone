export * from "./board.payloads";
export * from "./comment.payloads";
export * from "./file.payloads";
export * from "./label.payloads";
export * from "./task.payloads";
export * from "./user.payloads";

export interface RelationshipPayload {
  connect?: {
    id: string | undefined;
  };
  disconnect?: {
    id: string | undefined;
  };
}

export interface GetPayload<T> {
  items: T[];
}
