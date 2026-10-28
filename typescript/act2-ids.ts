// ACT 2, IDs in TypeScript.
type Money = number;

// BEFORE: plain strings. The swapped call compiles.
function issueBefore(customerId: string, orderId: string, amount: Money) {
  console.log(`  Refunding ${amount} for order ${orderId} to customer ${customerId}`);
}
issueBefore("ord_1001", "cus_42", 1500); // swapped, no error

// AFTER: branded types. This is the standard TS answer and it works at compile time.
declare const brand: unique symbol;
type Brand<T, B extends string> = T & { readonly [brand]: B };
type OrderId = Brand<string, "OrderId">;
type CustomerId = Brand<string, "CustomerId">;

// You must write (and everyone must use) a validating constructor per ID.
const OrderId = (v: string): OrderId => {
  if (!v.startsWith("ord_")) throw new Error(`Not an order id: ${v}`);
  return v as OrderId;
};
const CustomerId = (v: string): CustomerId => {
  if (!v.startsWith("cus_")) throw new Error(`Not a customer id: ${v}`);
  return v as CustomerId;
};

function issue(customerId: CustomerId, orderId: OrderId, amount: Money) {
  console.log(`  Refunding ${amount} for order ${orderId} to customer ${customerId}`);
}
const order = OrderId("ord_1001");
const customer = CustomerId("cus_42");
issue(customer, order, 1500);
// issue(order, customer, 1500); // ← uncomment: compile error. Good!

// THE LEAKS. Each line below compiles and skips validation entirely.
const fromApi = JSON.parse('{"orderId":"cus_42"}') as { orderId: OrderId }; // trusts the wire
const viaCast = customer as unknown as OrderId;                              // double cast
const viaAny: OrderId = (customer as any);                                   // any
issue(customer, fromApi.orderId, 1500);
console.log("  Leaked ids:", fromApi.orderId, viaCast, viaAny);
