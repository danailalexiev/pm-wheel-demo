// ACT 1, the TS that DOES catch the new state. It works. Count what it costs.
import { OrderState, OrderKind, eur } from "./domain";

// Cost 1: a helper every team has to write (or import) and remember to call.
export function assertNever(x: never): never {
  throw new Error(`Unhandled state: ${JSON.stringify(x)}`);
}

// Cost 2: `default: return assertNever(s)` in every switch, forever.
export function emailSubject(s: OrderState): string {
  switch (s.kind) {
    case "placed": return "We got your order";
    case "paid": return `Payment of ${eur(s.amount)} received`;
    case "shipped": return `On its way! Tracking: ${s.tracking}`;
    case "delivered": return "Delivered! 🎉";
    case "refunded": return `Refund of ${eur(s.amount)} issued`;
    default: return assertNever(s);
  }
}

// Cost 3: lookup tables must be keyed by the union, not by `string`.
const badgeColors = {
  placed: "grey", paid: "blue", shipped: "purple", delivered: "green", refunded: "red",
} satisfies Record<OrderKind, string>;
export const badgeColor = (s: OrderState) => badgeColors[s.kind];

// Cost 4: boolean shortcuts are banned; use a full switch instead.
export function canRefund(s: OrderState): boolean {
  switch (s.kind) {
    case "placed": return false;
    case "paid": case "shipped": case "delivered": return true;
    case "refunded": return false;
    default: return assertNever(s);
  }
}

// Cost 5: void switches need the same ritual, or the
// @typescript-eslint/switch-exhaustiveness-check rule (requires typed linting).
export function track(s: OrderState): void {
  switch (s.kind) {
    case "placed": case "paid": case "shipped": case "delivered": case "refunded":
      console.log(`  [analytics] order_${s.kind}`);
      break;
    default: assertNever(s);
  }
}
