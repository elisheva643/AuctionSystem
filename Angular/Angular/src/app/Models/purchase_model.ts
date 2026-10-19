export interface Purchase {
  id?: number;
  userId: number;
  giftId: number;
  quantity: number;
  isDraft: boolean;
  gift?: {
    name: string;
    price: number;
  };
}