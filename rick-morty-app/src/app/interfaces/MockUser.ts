import { User } from './User';

// Interface para usuario de mock (incluye password) + Extiende de User
export interface MockUser extends User {
  password: string;
}
