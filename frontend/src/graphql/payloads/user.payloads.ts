export interface UserResponsePayload {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  team?: {
    items: {
      id: string;
      name: string;
    };
  };
  roles: {
    items: Role[];
  };
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

interface Role {
  name: string;
}
