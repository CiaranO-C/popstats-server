interface UserType {
  id: string;
  username: string;
}

type UserRole = "USER" | "ADMIN" | "DEMO" | "TEMPORARY";

export type { UserType, UserRole };
