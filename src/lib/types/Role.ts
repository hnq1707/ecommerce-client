import {Permission} from "./Permission";

export type Role = {
  name: string;
  description: string;
  permissions: Permission[];
};