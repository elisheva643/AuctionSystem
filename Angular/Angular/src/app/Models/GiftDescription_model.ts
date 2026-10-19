import { Gift } from "./gift_model";

export interface GiftDescription {
  id?: number;
  giftId: number;
  donorId: number;
  quantity: number;
  gift?: Gift;
  
}