import { Role } from './Role';
import { Address } from './Address';

// Define User type
export type User = {
  id: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  phoneNumber: string;
  email: string;
  roles: Role[];
  addressList: Address[];
};
