import { GiftDescription } from "./GiftDescription_model";

export interface Donor {
  id?: number; 
  name: string;
  email: string;
   giftDescription?: GiftDescription[];
}