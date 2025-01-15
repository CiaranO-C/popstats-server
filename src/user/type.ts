import { $Enums } from "@prisma/client";

type UserType = {
  id: string;
  createdAt: Date;
  username: string;
  password: string;
  role: $Enums.Role;
};

export type { UserType };
