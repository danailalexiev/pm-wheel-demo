// ACT 1, the TS code most teams actually have. Everything here is idiomatic,
// passes `strict: true`, and survives code review. None of it notices a new state.
import { OrderState, eur } from "./domain";

// 1. A `default` someone added "for safety" (or to silence a warning).
export function emailSubject(s: OrderState): string {
  switch (s.kind) {
    case "placed": return "We got your order";
    case "paid": return `Payment of ${eur(s.amount)} received`;
    case "shipped": return `On its way! Tracking: ${s.tracking}`;
    case "refunded": return `Refund of ${eur(s.amount)} issued`;
    default: return "Delivered! 🎉";
  }
}

// 2. A lookup table typed loosely, with a fallback.
const badgeColors: Record<string, string> = {
  placed: "grey", paid: "blue", shipped: "purple", delivered: "green", refunded: "red",
};
export const badgeColor = (s: OrderState) => badgeColors[s.kind] ?? "green";

// 3. An allow-list written as a boolean expression.
export const canRefund = (s: OrderState) =>
  s.kind === "paid" || s.kind === "shipped" || s.kind === "delivered";

// 4. A void switch with no default: TS doesn't require exhaustiveness here.
export function track(s: OrderState): void {
  switch (s.kind) {
    case "placed": log("order_placed"); break;
    case "paid": log("order_paid", s.amount); break;
    case "shipped": log("order_shipped"); break;
    case "delivered": log("order_delivered"); break;
    case "refunded": log("order_refunded", s.amount); break;
  }
}
const log = (e: string, v?: number) => console.log(`  [analytics] ${e}${v ? ` value=${v}` : ""}`);

const states: OrderState[] = [
  { kind: "placed" },
  { kind: "paid", amount: 4999 },
  { kind: "delivered" },
  { kind: "refunded", amount: 4999 },
  // ← PM CHANGE: uncomment together with the new state
  // { kind: "partially_refunded", refunded: 1500, remaining: 3499 },
];
for (const s of states) {
  console.log(`${s.kind} | ${badgeColor(s)} | email: "${emailSubject(s)}" | canRefund=${canRefund(s)}`);
  track(s);
}
