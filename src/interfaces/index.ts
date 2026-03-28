export interface GoldPrice {
  buy: string
  sell: string
}

export type GoldMap = Record<string, GoldPrice>;

export type OilRecord = Record<string, string>;