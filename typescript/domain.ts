// Shared domain type, used by both TS variants.
export type Money = number; // cents

export type OrderState =
  | { kind: "placed" }
  | { kind: "paid"; amount: Money }
  | { kind: "shipped"; tracking: string }
  | { kind: "delivered" }
  | { kind: "refunded"; amount: Money }
  // ← PM CHANGE: uncomment this one line on stage
  // | { kind: "partially_refunded"; refunded: Money; remaining: Money }
  ;

export type OrderKind = OrderState["kind"];

export const eur = (cents: Money) => `€${(cents / 100).toFixed(2)}`;
