import { Role } from './Role';
import { Address } from './Address';

// Define User types
export type User = {
  id: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  phoneNumber: string;
  email: string;
  enabled: boolean;
  roles: Role[];
  addressList: Address[];
};
