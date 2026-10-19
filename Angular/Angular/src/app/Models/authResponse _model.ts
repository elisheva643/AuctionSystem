import { Register } from "./register_model";

export interface AuthResponse {
  token: string;
  user: Register; 
}